/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { createUserTokens } from "../../utils/userTokens";
import { Wallet } from "../wallet/wallet.model";

const credentialsLogin = async (payload: {
  identifier?: string;
  email?: string;
  name?: string;
  password?: string;
  imHuman?: boolean; // ✅ new field
}) => {
  const identifier = payload.identifier || payload.email || payload.name;
  const { password, imHuman } = payload;

  if (!identifier || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Username/email and password are required"
    );
  }

  // 🔥 Find by email OR name
  const user = await User.findOne({
    $or: [{ email: identifier }, { name: identifier }],
  });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(password, user.password as string);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
  }

  // ✅ Update imHuman if provided
  if (typeof imHuman === "boolean") {
    user.imHuman = imHuman;
    await user.save();
  }

  const userTokens = createUserTokens(user);

  const { password: pass, ...rest } = user.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest, // includes imHuman now
  };
};
const getMe = async (userId: string) => {
  if (!userId) throw new Error("User ID is required");

  // Get user without sensitive info
  const user = await User.findById(userId).select("-password -__v");
  if (!user) throw new Error("User not found");

  // Get user's wallet
  const wallet = await Wallet.findOne({ user: userId }).select("-__v");

  // Combine user and wallet data
  const userObject = user.toObject();
  
  return {
    ...userObject,
    wallet: wallet ? {
      balance: wallet.balance,
      walletAddress: wallet.walletAddress,
      protocol: wallet.protocol,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt
    } : {
      balance: 0,
      walletAddress: null,
      protocol: null
    }
  };
};

export const AuthServices = { credentialsLogin ,getMe};
