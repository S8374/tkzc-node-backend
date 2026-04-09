import { IAutoDeposit } from "./auto-deposite.interface";
import { AutoDeposit } from "./auto-deposite.model";

const handleCallback = async (payload: IAutoDeposit) => {
  // Save or update. If transaction_id already exists, skip or update.
  const existing = await AutoDeposit.findOne({ transaction_id: payload.transaction_id });
  if (existing) {
    return existing;
  }
  
  const autoDeposit = await AutoDeposit.create(payload);
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
