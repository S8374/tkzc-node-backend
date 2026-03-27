
import { Schema, Types, model } from "mongoose";
import { IInstruction, IPaymentMethod, ITittle } from "./deposite.interface";

const paymentMethodSchema = new Schema<IPaymentMethod>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    icon: {
      type: String,
      required: true,
    },
    tab: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const PaymentMethodModel = model<IPaymentMethod>(
  "PaymentMethod",
  paymentMethodSchema
);



const instructionSchema = new Schema<IInstruction>(
  {
    step: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    tab: {
      type: String,
      required: true,
      index: true,
    },
    paymentMethodId: {           // ✅ NEW: link to payment method
      type: Types.ObjectId,
      ref: "PaymentMethod",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const InstructionModel = model<IInstruction>(
  "Instruction",
  instructionSchema
);



const tittleSchema = new Schema<ITittle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    tab: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TittleModel = model<ITittle>("Tittle", tittleSchema);