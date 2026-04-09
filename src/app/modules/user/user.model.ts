import { Schema, model } from "mongoose";
import { IAuthProvider, IUser, Role, IsActive } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  { provider: { type: String, required: true }, providerId: { type: String, required: true } },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
email: {
  type: String,
  lowercase: true,
  trim: true,
  // Do NOT add unique: true or sparse: true unless you really want uniqueness on email
  // If you do want optional unique email later → add: unique: true, sparse: true
},
    password: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    referralCode: { type: String, unique: true }, // unique referral code per user
    referredBy: { type: Schema.Types.ObjectId, ref: "User" }, // the user who referred this user
    isDeleted: { type: Boolean, default: false },
    imHuman :{type:Boolean , default : false},
    isActive: { type: String, enum: Object.values(IsActive), default: IsActive.ACTIVE },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
  },
  { timestamps: true, versionKey: false }
);

export const User = model<IUser>("User", userSchema);
