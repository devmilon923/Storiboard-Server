import jwt from "jsonwebtoken";
const privateToken = process.env.JWT_SECRET_KEY as string;
console.log(privateToken);
export const verificationToken = (
  userId: string,
  type: "accountVerification" | "forgetPassword",
) => {
  return jwt.sign({ user: userId, type: "accountVerification" }, privateToken);
};
export const decodeToken = (token: string) => {
  return jwt.verify(token, privateToken);
};
