import z from "zod";

export const MediaTypeEnum = z.enum(["movie", "manga", "anime", "tvshow", "book"]);
export const MediaStatusEnum = z.enum(["watching", "planning", "on_hold", "completed", "dropped"]);

export const MediaSchema = z.object ({
      title: z.string(),
      type: MediaTypeEnum,
      status: MediaStatusEnum.default("watching"),
      rating: z.number().min(0.5).max(5).multipleOf(0.5).optional(),
      notes: z.string().nullable().optional(),
      imageUrl: z.string().url().nullable().optional(),
})