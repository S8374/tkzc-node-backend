import { Schema, model, Types } from "mongoose";
import { IFormField } from "./input.interface";

const formFieldSchema = new Schema<IFormField>(
  {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    tab: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["text", "number", "textarea", "screenshot", "static"],
      required: true,
    },
    placeholder: String,
    required: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    paymentMethodId: {
      type: Types.ObjectId,
      ref: "PaymentMethod",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBonusField: {
      type: Boolean,
      default: false
    },
    staticValue: {
      type: String,
      default: ''
    },
    isCopyable: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, versionKey: false }
);

export const FormFieldModel = model<IFormField>(
  "FormField",
  formFieldSchema
);