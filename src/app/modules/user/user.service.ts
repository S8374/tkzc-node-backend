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

export const UserServices = { createUser, getUserStats };
