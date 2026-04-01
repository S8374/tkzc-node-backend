import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { IWithdrawRequest, WithdrawStatus } from "./withdrawRequest.interface";
import { WithdrawRequest } from "./withdrawRequest.model";

const MIN_WITHDRAW_AMOUNT = 100;
const MAX_WITHDRAW_AMOUNT = 25000;

type TQuery = Record<string, unknown>;

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
};

const createWithdrawRequest = async (userId: string, payload: Partial<IWithdrawRequest>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const amount = Number(payload.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Withdraw amount must be a valid number");
    }

    if (amount < MIN_WITHDRAW_AMOUNT || amount > MAX_WITHDRAW_AMOUNT) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Withdraw amount must be between ৳${MIN_WITHDRAW_AMOUNT} and ৳${MAX_WITHDRAW_AMOUNT}`
      );
    }

    if (!payload.paymentMethod || !payload.accountNumber) {
      throw new AppError(httpStatus.BAD_REQUEST, "Payment method and account number are required");
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found");
    }

    if (wallet.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance for withdrawal");
    }

    wallet.balance -= amount;
    await wallet.save({ session });

    const request = await WithdrawRequest.create(
      [
        {
          user: user._id,
          userName: user.name,
          userEmail: user.email,
          paymentMethod: payload.paymentMethod,
          accountNumber: payload.accountNumber,
          amount,
          status: WithdrawStatus.PENDING,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return request[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllWithdrawRequests = async (query: TQuery) => {
  const page = parsePositiveInt(query.page, 1);
  const limit = parsePositiveInt(query.limit, 10);
  const status = typeof query.status === "string" ? query.status : undefined;
  const paymentMethod =
    typeof query.paymentMethod === "string" ? query.paymentMethod : undefined;
  const search = typeof query.search === "string" ? query.search : undefined;
  const startDate = typeof query.startDate === "string" ? query.startDate : undefined;
  const endDate = typeof query.endDate === "string" ? query.endDate : undefined;

  const filter: Record<string, unknown> = {};

  if (status) filter.status = status;
  if (paymentMethod) filter.paymentMethod = paymentMethod;

  if (search) {
    filter.$or = [
      { userName: { $regex: search, $options: "i" } },
      { userEmail: { $regex: search, $options: "i" } },
      { accountNumber: { $regex: search, $options: "i" } },
      { adminTransactionId: { $regex: search, $options: "i" } },
    ];
  }

  if (startDate || endDate) {
    const createdAt: { $gte?: Date; $lte?: Date } = {};
    if (startDate) createdAt.$gte = new Date(startDate);
    if (endDate) createdAt.$lte = new Date(endDate);
    filter.createdAt = createdAt;
  }

  const skip = (page - 1) * limit;

  const requests = await WithdrawRequest.find(filter)
    .populate("user", "name email phone")
    .populate("processedBy", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await WithdrawRequest.countDocuments(filter);

  const stats = await WithdrawRequest.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: requests,
    stats,
  };
};

const getUserWithdrawRequests = async (userId: string, query: TQuery) => {
  const page = parsePositiveInt(query.page, 1);
  const limit = parsePositiveInt(query.limit, 10);
  const status = typeof query.status === "string" ? query.status : undefined;

  const filter: Record<string, unknown> = { user: userId };
  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const requests = await WithdrawRequest.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await WithdrawRequest.countDocuments(filter);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: requests,
  };
};

const getSingleWithdrawRequest = async (id: string) => {
  const request = await WithdrawRequest.findById(id)
    .populate("user", "name email phone")
    .populate("processedBy", "name");

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Withdraw request not found");
  }

  return request;
};

const processWithdrawRequest = async (
  id: string,
  adminId: string,
  status: WithdrawStatus.APPROVED | WithdrawStatus.REJECTED,
  payload: { adminNote?: string; adminSenderNumber?: string; adminTransactionId?: string }
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await WithdrawRequest.findById(id).session(session);
    if (!request) {
      throw new AppError(httpStatus.NOT_FOUND, "Withdraw request not found");
    }

    if (request.status !== WithdrawStatus.PENDING) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Request already ${request.status.toLowerCase()}`
      );
    }

    if (status === WithdrawStatus.APPROVED && !payload.adminSenderNumber) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Admin sender number is required before approval"
      );
    }

    request.status = status;
    request.adminNote = payload.adminNote;
    request.adminSenderNumber = payload.adminSenderNumber;
    request.adminTransactionId = payload.adminTransactionId;
    request.processedAt = new Date();
    request.processedBy = new mongoose.Types.ObjectId(adminId);
    await request.save({ session });

    // If rejected, return held balance to user wallet.
    if (status === WithdrawStatus.REJECTED) {
      const wallet = await Wallet.findOne({ user: request.user }).session(session);
      if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
      }
      wallet.balance += request.amount;
      await wallet.save({ session });
    }

    await session.commitTransaction();
    return request;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const cancelWithdrawRequest = async (id: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await WithdrawRequest.findOne({ _id: id, user: userId }).session(session);
    if (!request) {
      throw new AppError(httpStatus.NOT_FOUND, "Withdraw request not found");
    }

    if (request.status !== WithdrawStatus.PENDING) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Only pending requests can be cancelled"
      );
    }

    request.status = WithdrawStatus.CANCELLED;
    request.processedAt = new Date();
    await request.save({ session });

    const wallet = await Wallet.findOne({ user: request.user }).session(session);
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    wallet.balance += request.amount;
    await wallet.save({ session });

    await session.commitTransaction();
    return request;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const WithdrawRequestService = {
  createWithdrawRequest,
  getAllWithdrawRequests,
  getUserWithdrawRequests,
  getSingleWithdrawRequest,
  processWithdrawRequest,
  cancelWithdrawRequest,
};
