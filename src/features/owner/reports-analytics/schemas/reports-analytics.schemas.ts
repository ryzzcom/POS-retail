import { z } from "zod";

export const dateRangeFilterSchema = z.object({
  preset: z.enum(["today", "last7days", "thismonth", "custom"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export type DateRangeFilterInput = z.infer<typeof dateRangeFilterSchema>;
