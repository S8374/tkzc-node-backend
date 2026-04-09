import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;             // required
    email?: string;           // optional
    password?: string;        // required for login
    phone?: string;
    picture?: string;
    address?: string;
    imHuman:boolean;
    referralCode?: string;    // optional
    referredBy?: Types.ObjectId; // the user who referred this user
    isDeleted?: boolean;
    isActive?: IsActive;
    isVerified?: boolean;
    role: Role;
    auths: IAuthProvider[];
}
