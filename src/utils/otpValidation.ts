import bcrypt from "bcrypt";
export const generateOTP = () => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const plainOTP = ((array[0] % 90000) + 10000).toString();
  const hash = bcrypt.hashSync(plainOTP, 10);
  return {
    plainToken: plainOTP,
    hash: hash,
  };
};

export const verifyOTP = (redisOtp: string, userOtp: string) => {
  return bcrypt.compareSync(
    userOtp.toString().trim(),
    redisOtp.toString().trim(),
  );
};
