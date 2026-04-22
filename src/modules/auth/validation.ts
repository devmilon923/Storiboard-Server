import z from "zod";

export const loginValidation = z.object({
  email: z.email().min(1, "Email is required").trim(),
  password: z.string().min(1, "Password is required").trim(),
});
export const registrationValidation = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  image: z.string().min(1, "Image path is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character (!@#$%^&*)",
    ),
  gender: z.enum(["Male", "Female", "Others"], {
    error: "Please select your gender",
  }),
  profession: z.enum(["Student", "Teacher", "Doctor", "Engineer"], {
    error: "Please select your profession",
  }),
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
export const renewToken = z.object({
  userId: z.number().min(1, "User id is required"),
  refreshToken: z.string().min(1, "Refresh token is required"),
});
