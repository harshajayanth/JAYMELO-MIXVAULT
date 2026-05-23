import { z } from "zod";

export const ChainStepSchema = z.object({
  name: z.string().min(1, "Step name is required"),
  settings: z.record(z.union([z.string(), z.number()])).optional(),
  description: z.string().optional(),
});

export const ChainSchema = z.object({
  id: z.string().min(1, "Chain ID is required"),
  name: z.string().min(1, "Chain name is required"),
  description: z.string().optional(),
  steps: z.array(ChainStepSchema),
  referenceImages: z.array(z.string().url()).optional(),
  downloadUrl: z.string().optional(),
});

export const CategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Category name is required"),
  icon: z.string().optional(),
  chains: z.array(ChainSchema),
});

export const AppDataSchema = z.object({
  categories: z.array(CategorySchema),
});

export type AppData = z.infer<typeof AppDataSchema>;
