import z from "zod";

const createPostValidation = z.object({
  content: z.string().min(1, "Content is required"),
  feeling: z.object({
    emoji: z.string(),
    label: z.enum([
      "Happy",
      "Excited",
      "Blessed",
      "Sad",
      "Thinking",
      "Cool",
      "Tired",
    ]),
  }),
});

const updatePostValidation = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  feelings: z.object({
    emoji: z.string().optional(),
    label: z.enum([
      "Happy",
      "Excited",
      "Blessed",
      "Sad",
      "Thinking",
      "Cool",
      "Tired",
    ]),
  }),
});

export { createPostValidation, updatePostValidation };
