/* eslint-disable @typescript-eslint/no-explicit-any */
import bcryptjs from "bcryptjs";
import { Wallet } from "./wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const updateWallet = async (
  userId: string,
  payload: {
    walletPassword?: string;
    walletAddress?: string;
    protocol?: string;
  }
) => {

  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
 
  if (payload.walletPassword) {
    const hashedWalletPass = await bcryptjs.hash(
      payload.walletPassword,
      10
    );
    wallet.walletPassword = hashedWalletPass;
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
