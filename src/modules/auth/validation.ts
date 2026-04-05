import z from "zod";

export const loginValidation = z.object({
  email: z.string().min(1, "Email is required").trim(),
  password: z.string().min(1, "Password is required").trim(),
});
