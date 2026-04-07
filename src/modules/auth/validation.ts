import z from "zod";

export const loginValidation = z.object({
  email: z.email().min(1, "Email is required").trim(),
  password: z.string().min(1, "Password is required").trim(),
});
export const registrationValidation = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.email().min(1, "Email is required").trim(),
  password: z.string().min(1, "Password is required").trim(),
});

export const verifyAccount = z.object({
  otp: z.number().min(1, "Otp is required"),
});


