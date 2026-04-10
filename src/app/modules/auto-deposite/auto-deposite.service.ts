import { IAutoDeposit } from "./auto-deposite.interface";
import { AutoDeposit } from "./auto-deposite.model";
import { DepositRequest } from "../depositRequest/depositRequest.model";
import { DepositType, DepositStatus } from "../depositRequest/depositRequest.interface";
import { User } from "../user/user.model";
import { PaymentMethodModel } from "../deposite/deposite.model";

const handleCallback = async (payload: IAutoDeposit) => {
  // Save or update. If transaction_id already exists, skip or update.
  const existing = await AutoDeposit.findOne({ transaction_id: payload.transaction_id });
  if (existing) {
    return existing;
  }
  
  const autoDeposit = await AutoDeposit.create(payload);

  // Extract metadata from invoice_number:
  // New: AUTO_userId_methodId_baseAmountCents_bonusCents_totalWithBonusCents_turnoverRequiredCents_turnoverMultiplier_bonusPercentage_timestamp
  // Old: AUTO_userId_methodId_bonusCents_totalWithBonusCents_turnoverRequiredCents_turnoverMultiplier_bonusPercentage_timestamp
  const invoiceParts = payload.invoice_number.split("_");
  if (invoiceParts[0] === "AUTO" && invoiceParts.length >= 4) {
    const userId = invoiceParts[1];
    const methodId = invoiceParts[2];

    const hasNewMetadata = invoiceParts.length >= 10;
    const hasOldMetadata = invoiceParts.length >= 9;

    const metadataSelectedAmount = hasNewMetadata ? Number(invoiceParts[3] || 0) / 100 : undefined;
    const metadataBonusAmount = hasNewMetadata
      ? Number(invoiceParts[4] || 0) / 100
      : hasOldMetadata
        ? Number(invoiceParts[3] || 0) / 100
        : undefined;
    const metadataTotalWithBonus = hasNewMetadata
      ? Number(invoiceParts[5] || 0) / 100
      : hasOldMetadata
        ? Number(invoiceParts[4] || 0) / 100
        : undefined;
    const metadataTurnoverRequired = hasNewMetadata
      ? Number(invoiceParts[6] || 0) / 100
      : hasOldMetadata
        ? Number(invoiceParts[5] || 0) / 100
        : undefined;
    const metadataTurnoverMultiplier = hasNewMetadata
      ? Number(invoiceParts[7] || 0)
      : hasOldMetadata
        ? Number(invoiceParts[6] || 0)
        : undefined;
    const metadataBonusPercentage = hasNewMetadata
      ? Number(invoiceParts[8] || 0)
      : hasOldMetadata
        ? Number(invoiceParts[7] || 0)
        : undefined;
    
    try {
      const [user, paymentMethod] = await Promise.all([
        User.findById(userId),
        PaymentMethodModel.findById(methodId)
      ]);

      if (user) {
        const selectedAmount = Number((metadataSelectedAmount ?? payload.amount).toFixed(2));
        const payableAmount = Number((payload.amount || metadataTotalWithBonus || selectedAmount).toFixed(2));
        const bonusAmount = Number((metadataBonusAmount ?? 0).toFixed(2));
        const totalWithBonus = Number(((metadataTotalWithBonus ?? (selectedAmount + bonusAmount))).toFixed(2));
        const bonusPercentage = Number((metadataBonusPercentage ?? (selectedAmount > 0
          ? (bonusAmount / selectedAmount) * 100
          : 0)).toFixed(2));
        const tournOverMultiplier = Number((metadataTurnoverMultiplier ?? 0).toFixed(2));
        const turnoverRequired = Number((metadataTurnoverRequired ?? (tournOverMultiplier > 0
          ? totalWithBonus * tournOverMultiplier
          : 0)).toFixed(2));

        // Create a DepositRequest so it shows up in the admin dashboard
        await DepositRequest.create({
          user: user._id,
          userName: user.name,
          userEmail: user.email,
          depositType: DepositType.AUTO,
          paymentMethod: paymentMethod?.name || payload.bank || "OraclePay",
          amount: selectedAmount,
          bonusAmount: bonusAmount,
          turnoverMultiplier: tournOverMultiplier,
          turnoverRequired: turnoverRequired,
          transactionId: payload.transaction_id,
          status: DepositStatus.PENDING,
          formData: {
            invoice_number: payload.invoice_number,
            session_code: payload.session_code,
            bank: payload.bank,
            paymentMethodId: methodId,
            selectedAmount,
            payableAmount,
            bonusPercentage,
            totalWithBonus,
            turnoverMultiplier: tournOverMultiplier,
            turnoverRequired,
          }
        });

        // Also update the AutoDeposit log with these values
        await AutoDeposit.findByIdAndUpdate(autoDeposit._id, {
          selectedAmount,
          payableAmount,
          bonusAmount,
          bonusPercentage,
          totalWithBonus,
          turnoverMultiplier: tournOverMultiplier,
          turnoverRequired
        });
      }
    } catch (error) {
      console.error("Failed to create DepositRequest from auto-deposit callback:", error);
    }
  }

  return autoDeposit;
};

const getAllAutoDeposits = async (query: any) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {};
  if (search) {
    filter.$or = [
      { transaction_id: { $regex: search, $options: "i" } },
      { invoice_number: { $regex: search, $options: "i" } },
      { bank: { $regex: search, $options: "i" } },
    ];
  }

  const result = await AutoDeposit.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
    
  const total = await AutoDeposit.countDocuments(filter);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
    data: result,
  };
};

export const AutoDepositServices = {
  handleCallback,
  getAllAutoDeposits,
};
