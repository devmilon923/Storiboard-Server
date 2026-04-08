import z from "zod";

export const loginValidation = z.object({
  email: z.email().min(1, "Email is required").trim(),
  password: z.string().min(1, "Password is required").trim(),
});
export const registrationValidation = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.email().min(1, "Email is required").trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

export const verifyAccount = z.object({
  otp: z.number().min(1, "Otp is required"),
});

export const forgetPassword = z.object({
  email: z.email().min(1, "Email is required"),
});

export const newPassword = z.object({
  otp: z.number().min(5, "Valid otp is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});
