import { Document, Types } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string;
  address: string;
  emailVerification: boolean;
  accountVerification: boolean;
} & Document;

export type TOtp = {
  secureOtp: string;
  user: Types.ObjectId;
} & Document;
