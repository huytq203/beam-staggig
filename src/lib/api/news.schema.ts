"server-only";

import * as yup from "yup";

export const createNewsSchema = yup.object({
  title: yup.string().required("Vui lòng nhập tiêu đề"),
  slug: yup.string().required("Vui lòng nhập slug"),
  coverImage: yup.string().nullable().default(null),
  description: yup.string().nullable().default(null),
  content: yup.string().nullable().default(null),
  isHotNew: yup.boolean().default(false),
  tags: yup.string().nullable().default(null),
  shows: yup.boolean().default(true),
  status: yup.string().oneOf(["ACTIVE", "DRAFT"]).default("DRAFT"),
  createdBy: yup.string().nullable().default(null),
  updatedBy: yup.string().nullable().default(null),
});

export const updateNewsSchema = yup.object({
  title: yup.string(),
  slug: yup.string(),
  coverImage: yup.string().nullable(),
  description: yup.string().nullable(),
  content: yup.string().nullable(),
  isHotNew: yup.boolean(),
  tags: yup.string().nullable(),
  shows: yup.boolean(),
  status: yup.string().oneOf(["ACTIVE", "DRAFT"]),
  updatedBy: yup.string().nullable(),
});
