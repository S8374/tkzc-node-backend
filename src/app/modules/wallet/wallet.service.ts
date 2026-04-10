/* eslint-disable @typescript-eslint/no-explicit-any */
import bcryptjs from "bcryptjs";
import { Wallet } from "./wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const updateWallet = async (
  userId: string,
  payload: {
    // Backward compatible field (maps to newWalletPassword)
    walletPassword?: string;
    newWalletPassword?: string;
    currentWalletPassword?: string;
    walletAddress?: string;
    protocol?: string;
    clearWalletAddress?: boolean;
  }
) => {

  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  const newWalletPassword = payload.newWalletPassword || payload.walletPassword;

  // Set/Update withdraw password
  if (newWalletPassword) {
    if (wallet.walletPassword && !payload.currentWalletPassword) {
      throw new AppError(httpStatus.BAD_REQUEST, "Current withdraw password is required");
    }

    if (wallet.walletPassword && payload.currentWalletPassword) {
      const isCurrentPasswordMatched = await bcryptjs.compare(
        payload.currentWalletPassword,
        wallet.walletPassword
      );

      if (!isCurrentPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Current withdraw password is incorrect");
      }
    }

    const hashedWalletPass = await bcryptjs.hash(
      newWalletPassword,
      10
    );
    wallet.walletPassword = hashedWalletPass;
  }

  const isAddressMutation = Boolean(payload.walletAddress || payload.protocol || payload.clearWalletAddress);

  if (isAddressMutation) {
    if (!wallet.walletPassword) {
      throw new AppError(httpStatus.BAD_REQUEST, "Please set withdraw password first");
    }

    if (!payload.currentWalletPassword) {
      throw new AppError(httpStatus.BAD_REQUEST, "Withdraw password is required");
    }

    const isPasswordMatched = await bcryptjs.compare(
      payload.currentWalletPassword,
      wallet.walletPassword
    );

    if (!isPasswordMatched) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid withdraw password");
    }
  }

  if (payload.clearWalletAddress) {
    wallet.walletAddress = undefined;
    wallet.protocol = undefined;
  }

  if (payload.walletAddress) {
    wallet.walletAddress = payload.walletAddress;
  }

  if (payload.protocol) {
    wallet.protocol = payload.protocol as any;
  }

  await wallet.save();

  return wallet;
};
// Get wallet by user ID
const getWalletByUser = async (userId: string) => {
  console.log("Fetching wallet for user ID:", userId); // Debug log
  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found for this user");
  }

  return wallet;
};
export const WalletServices = { updateWallet , getWalletByUser};
