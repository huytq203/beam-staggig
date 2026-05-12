"server-only";

import { images_control } from "@prisma/client";
import { CreateFileRecord } from "./types/type";

export interface FileManagerResponse {
  id: string;
  name: string;
  url: string;
  originalName: string;
  fileType: string;
  type: string;
  userId: string;
  createdAt: string | null;
}

export function toFileManagerResponse(data: images_control): FileManagerResponse {
  return {
    id: data.id,
    name: data.name,
    url: data.url,
    originalName: data.original_name,
    fileType: data.file_type,
    type: "NEWS",
    userId: data.user_id,
    createdAt: data.created_at?.toISOString() ?? null,
  };
}

export function toFileManagerEntity(data: CreateFileRecord) {
  return {
    name: data.name,
    url: data.url,
    original_name: data.originalName,
    file_type: data.fileType,
    user_id: data.userId,
  };
}
