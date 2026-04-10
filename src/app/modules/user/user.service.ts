import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IUser, IAuthProvider } from "./user.interface";
import { User } from "./user.model";
import { Wallet } from "../wallet/wallet.model";
import { createUserTokens } from "../../utils/userTokens";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email, password, referralCode: incomingReferralCode, imHuman, ...rest } = payload;

  if (!name || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Username and password are required");
  }

  // Normalize email: treat empty string as undefined
  const normalizedEmail = email?.trim() ? email.trim().toLowerCase() : undefined;

  // Check username uniqueness
  const isNameExist = await User.findOne({ name });
  if (isNameExist) throw new AppError(httpStatus.BAD_REQUEST, "Username already exists");

  // Check email only if provided
  if (normalizedEmail) {
    const isEmailExist = await User.findOne({ email: normalizedEmail });
    if (isEmailExist) throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  // Find referring user if code provided
  let referredBy;
  if (incomingReferralCode) {
    const referrer = await User.findOne({ referralCode: incomingReferralCode });
    if (referrer) {
      referredBy = referrer._id;
    }
  }

  const hashedPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND));

  const authProvider: IAuthProvider = { provider: "credentials", providerId: name };

  // Generate unique referral code for the new user
  const newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    referralCode: newReferralCode,
    referredBy,
    imHuman: !!imHuman,
    auths: [authProvider],
    ...rest,
  });
  const userTokens = createUserTokens(user);

  await Wallet.create({ user: user._id, balance: 0 });

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user
  };
};

const getUserStats = async (userId: string) => {
  const directSubordinatesCount = await User.countDocuments({ referredBy: userId });
  return {
    directSubordinatesCount,
    newDirectSubordinatesCount: 0, 
  };
};

const updateCurrentUser = async (
  userId: string,
  payload: {
    email?: string;
    name?: string;
    phone?: string;
    address?: string;
    currentPassword?: string;
  }
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.email !== undefined) {
    if (!payload.currentPassword) {
      throw new AppError(httpStatus.BAD_REQUEST, "Current password is required to update email");
    }

    const isPasswordMatched = await bcryptjs.compare(payload.currentPassword, user.password as string);
    if (!isPasswordMatched) {
      throw new AppError(httpStatus.BAD_REQUEST, "Current password is incorrect");
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
    }

    const emailExists = await User.findOne({ email: normalizedEmail, _id: { $ne: userId } });
    if (emailExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
    }

    user.email = normalizedEmail;
  }

  if (payload.name !== undefined && payload.name.trim()) {
    const nameExists = await User.findOne({ name: payload.name.trim(), _id: { $ne: userId } });
    if (nameExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Username already exists");
    }
    user.name = payload.name.trim();
  }

  if (payload.phone !== undefined) {
    user.phone = payload.phone;
  }

  if (payload.address !== undefined) {
    user.address = payload.address;
  }

  await user.save();
  const updatedUser = await User.findById(userId).select("-password -__v");
  return updatedUser;
};

const changeLoginPassword = async (
  userId: string,
  payload: {
    currentPassword: string;
    newPassword: string;
  }
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = await bcryptjs.compare(payload.currentPassword, user.password as string);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Current password is incorrect");
  }

  user.password = await bcryptjs.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND));
  await user.save();

  return true;
};

export const UserServices = { createUser, getUserStats, updateCurrentUser, changeLoginPassword };
