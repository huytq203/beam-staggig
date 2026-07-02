"server-only";

import { prisma } from "src/lib/prisma/prisma";
import { FileManagerResponse, toFileManagerEntity, toFileManagerResponse } from "./file-manager.entity";
import { CreateFileRecord } from "./types/type";

export async function insertFileRecord(data: CreateFileRecord): Promise<FileManagerResponse> {
  const entity = toFileManagerEntity(data);
  const record = await prisma.images_control.create({ data: entity });
  return toFileManagerResponse(record);
}

export async function getAllFiles(userId: string): Promise<FileManagerResponse[]> {
  const list = await prisma.images_control.findMany({
    where: {
      user_id: userId
    },
    orderBy: { created_at: "desc" },
  });
  return list.map(toFileManagerResponse);
}
