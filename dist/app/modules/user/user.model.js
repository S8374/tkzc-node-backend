"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({ provider: { type: String, required: true }, providerId: { type: String, required: true } }, { _id: false, versionKey: false });
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true, index: true },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        // Do NOT add unique: true or sparse: true unless you really want uniqueness on email
        // If you do want optional unique email later → add: unique: true, sparse: true
    },
    password: { type: String },
    role: { type: String, enum: Object.values(user_interface_1.Role), default: user_interface_1.Role.USER },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    referralCode: { type: String, unique: true }, // unique referral code per user
    referredBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" }, // the user who referred this user
    isDeleted: { type: Boolean, default: false },
    imHuman: { type: Boolean, default: false },
    isActive: { type: String, enum: Object.values(user_interface_1.IsActive), default: user_interface_1.IsActive.ACTIVE },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
}, { timestamps: true, versionKey: false });
exports.User = (0, mongoose_1.model)("User", userSchema);
