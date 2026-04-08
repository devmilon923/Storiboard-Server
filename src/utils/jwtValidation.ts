import jwt from "jsonwebtoken";
const privateToken = process.env.JWT_SECRET_KEY as string;
export type TJwtUser = {
  id: Number;
  name: String;
  email: String;
  isVerifyed: Boolean;
};
export const verificationToken = (
  userId: string,
  type: "accountVerification" | "forgetPassword",
) => {
  return jwt.sign({ user: userId, type }, privateToken, {
    expiresIn: 300,
  });
};

export const loginToken = (payload: TJwtUser) => {
  return jwt.sign(payload, privateToken, {
    expiresIn: 60,
  });
};
export const decodeToken = (token: string) => {
  return jwt.verify(token, privateToken);
};
