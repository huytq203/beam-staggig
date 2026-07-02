"server-only";

import * as yup from "yup";
import { sanitizePlainText, sanitizeRichText } from "./sanitize";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createNewsSchema = yup.object({
  title: yup
    .string()
    .required("Vui lòng nhập tiêu đề")
    .max(255, "Tiêu đề tối đa 255 ký tự")
    .transform((v) => sanitizePlainText(v) ?? v),
  slug: yup
    .string()
    .required("Vui lòng nhập slug")
    .max(255, "Slug tối đa 255 ký tự")
    .matches(slugRegex, "Slug chỉ chứa chữ thường, số và dấu gạch ngang"),
  coverImage: yup.string().url("Cover image phải là URL").nullable().default(null),
  description: yup
    .string()
    .max(2000)
    .nullable()
    .default(null)
    .transform((v) => sanitizePlainText(v) ?? null),
  content: yup
    .string()
    .nullable()
    .default(null)
    .transform((v) => sanitizeRichText(v) ?? null),
  isHotNew: yup.boolean().default(false),
  tags: yup.array().of(yup.string().max(50)).nullable().default(null),
  shows: yup.boolean().default(true),
  status: yup.string().oneOf(["ACTIVE", "DRAFT"]).default("DRAFT"),
});

export const updateNewsSchema = yup.object({
  title: yup.string().max(255).transform((v) => sanitizePlainText(v) ?? v),
  slug: yup.string().max(255).matches(slugRegex, "Slug không hợp lệ"),
  coverImage: yup.string().url().nullable(),
  description: yup
    .string()
    .max(2000)
    .nullable()
    .transform((v) => sanitizePlainText(v) ?? null),
  content: yup.string().nullable().transform((v) => sanitizeRichText(v) ?? null),
  isHotNew: yup.boolean(),
  tags: yup.array().of(yup.string().max(50)).nullable(),
  shows: yup.boolean(),
  status: yup.string().oneOf(["ACTIVE", "DRAFT"]),
});
