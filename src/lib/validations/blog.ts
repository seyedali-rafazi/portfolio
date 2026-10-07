import { z } from "zod";
import { isValidSlug, generateSlug } from "@/lib/blog/slug";

export const articleStatusEnum = z.enum(["DRAFT", "PUBLISHED"]);

export const createArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(150, "Slug cannot exceed 150 characters")
    .transform((val) => generateSlug(val))
    .refine((val) => isValidSlug(val), {
      message: "Slug must contain only alphanumeric characters and hyphens",
    }),
  excerpt: z
    .string()
    .trim()
    .min(5, "Excerpt must be at least 5 characters")
    .max(500, "Excerpt cannot exceed 500 characters"),
  content: z
    .string()
    .trim()
    .min(10, "Article content must be at least 10 characters"),
  coverImage: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  status: articleStatusEnum.default("DRAFT"),
  featured: z.boolean().default(false),
  authorId: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
  readingTime: z.number().int().positive().optional(),
  seoTitle: z
    .string()
    .trim()
    .max(120, "SEO title cannot exceed 120 characters")
    .optional()
    .nullable(),
  seoDescription: z
    .string()
    .trim()
    .max(250, "SEO description cannot exceed 250 characters")
    .optional()
    .nullable(),
  canonicalUrl: z
    .string()
    .trim()
    .url("Canonical URL must be a valid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export const updateArticleSchema = createArticleSchema.partial().extend({
  id: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(80, "Category name cannot exceed 80 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(80, "Slug cannot exceed 80 characters")
    .transform((val) => generateSlug(val))
    .refine((val) => isValidSlug(val), {
      message: "Slug must contain only alphanumeric characters and hyphens",
    }),
  description: z
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters")
    .optional()
    .nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tag name is required")
    .max(50, "Tag name cannot exceed 50 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(50, "Slug cannot exceed 50 characters")
    .transform((val) => generateSlug(val))
    .refine((val) => isValidSlug(val), {
      message: "Slug must contain only alphanumeric characters and hyphens",
    }),
});

export const updateTagSchema = createTagSchema.partial();

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
