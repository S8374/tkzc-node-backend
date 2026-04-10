import httpStatus from "http-status-codes";
import { IDepositRequest, DepositStatus, DepositType } from "./depositRequest.interface";
import { DepositRequest } from "./depositRequest.model";
import { Wallet } from "../wallet/wallet.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";
import { PromotionModel } from "../promotion/promotion.modal";
import AppError from "../../errorHelpers/AppError";

const createDepositRequest = async (userId: string, payload: Partial<IDepositRequest>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("userId", userId);
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (payload.depositType === DepositType.CRYPTO) {
      const formData = payload.formData || {};
      const proofUrl = payload.screenshot || formData.cryptoProof || formData.__cryptoProof;

      if (!proofUrl) {
        throw new AppError(httpStatus.BAD_REQUEST, "Crypto deposit proof screenshot is required");
      }

      const bdtEquivalent = Number(formData.cryptoBdtEquivalent || payload.amount || 0);
      if (!Number.isFinite(bdtEquivalent) || bdtEquivalent <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid crypto converted amount");
      }

      payload.screenshot = proofUrl;
      payload.amount = bdtEquivalent;
      payload.formData = {
        ...formData,
        cryptoProof: proofUrl,
        cryptoBdtEquivalent: bdtEquivalent,
      };
    }

    // Calculate bonus if promotion applied
    let bonusAmount = 0;
    if (payload.promotionId) {
      const promotion = await PromotionModel.findById(payload.promotionId);
      if (promotion && promotion.isActive) {
        // Check date range
        const now = new Date();
        if (promotion.startDate && promotion.startDate > now) {
          throw new AppError(httpStatus.BAD_REQUEST, "Promotion not started yet");
        }
        if (promotion.endDate && promotion.endDate < now) {
          throw new AppError(httpStatus.BAD_REQUEST, "Promotion has expired");
        }

        // Check minimum deposit
        if (promotion.minDeposit && payload.amount! < promotion.minDeposit) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Minimum deposit for this promotion is ৳${promotion.minDeposit}`
          );
        }

        // Calculate bonus
        if (promotion.type === "PERCENT") {
          bonusAmount = (payload.amount! * promotion.value) / 100;
        } else {
          bonusAmount = promotion.value;
        }

        // No maxBonus field in promotion
      }
    }

    // Create deposit request
    const depositRequest = await DepositRequest.create([{
      user: userId,
      userName: user.name,
      userEmail: user.email,
      ...payload,
      turnoverMultiplier: payload.turnoverMultiplier,
      turnoverRequired: payload.turnoverRequired,
      bonusAmount,
      status: DepositStatus.PENDING
    }], { session });

    await session.commitTransaction();
    return depositRequest[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllDepositRequests = async (query: any) => {
  const {
    page = 1,
    limit = 10,
    status,
    depositType,
    search,
    startDate,
    endDate
  } = query;

  const filter: any = {};

  if (status) filter.status = status;
  if (depositType) filter.depositType = depositType;

  if (search) {
    filter.$or = [
      { userName: { $regex: search, $options: "i" } },
      { userEmail: { $regex: search, $options: "i" } },
      { transactionId: { $regex: search, $options: "i" } }
    ];
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const requests = await DepositRequest.find(filter)
    .populate("user", "name email phone")
    .populate("processedBy", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await DepositRequest.countDocuments(filter);

  // Get statistics
  const stats = await DepositRequest.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        totalBonus: { $sum: "$bonusAmount" }
      }
    }
  ]);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: requests,
    stats
  };
};

const getUserDepositRequests = async (userId: string, query: any) => {
  const { page = 1, limit = 10, status } = query;

  const filter: any = { user: userId };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const requests = await DepositRequest.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await DepositRequest.countDocuments(filter);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: requests,
  };
};

const getSingleDepositRequest = async (id: string) => {
  const request = await DepositRequest.findById(id)
    .populate("user", "name email phone")
    .populate("processedBy", "name");

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Deposit request not found");
  }

  return request;
};

const processDepositRequest = async (
  id: string,
  adminId: string,
  status: DepositStatus.APPROVED | DepositStatus.REJECTED,
  adminNote?: string,
  bonusAmount?: number,
  turnoverRequired?: number
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await DepositRequest.findById(id).session(session);
    if (!request) {
      throw new AppError(httpStatus.NOT_FOUND, "Deposit request not found");
    }

    if (request.status !== DepositStatus.PENDING) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Request already ${request.status.toLowerCase()}`
      );
    }

    // Update request fields if provided by admin
    if (bonusAmount !== undefined) {
      request.bonusAmount = bonusAmount;
    }
    if (turnoverRequired !== undefined) {
      request.turnoverRequired = turnoverRequired;
    }

    // Update request status
    request.status = status;
    request.adminNote = adminNote;
    request.processedAt = new Date();
    request.processedBy = new mongoose.Types.ObjectId(adminId);
    await request.save({ session });

    // If approved, add to wallet
    if (status === DepositStatus.APPROVED) {
      const totalAmount = request.amount + (request.bonusAmount || 0);

      const wallet = await Wallet.findOne({ user: request.user }).session(session);
      if (wallet) {
        wallet.balance += totalAmount;
        // Also increase required turnover if applicable
        if (request.turnoverRequired && request.turnoverRequired > 0) {
          wallet.requiredTurnover = (wallet.requiredTurnover || 0) + request.turnoverRequired;
        }
        await wallet.save({ session });
      } else {
        // Create wallet if doesn't exist
        await Wallet.create([{
          user: request.user,
          balance: totalAmount,
          requiredTurnover: request.turnoverRequired || 0
        }], { session });
      }
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

const deleteDepositRequest = async (id: string) => {
  const request = await DepositRequest.findByIdAndDelete(id);
  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Deposit request not found");
  }
  return request;
};

export const DepositRequestService = {
  createDepositRequest,
  getAllDepositRequests,
  getUserDepositRequests,
  getSingleDepositRequest,
  processDepositRequest,
  deleteDepositRequest,
};