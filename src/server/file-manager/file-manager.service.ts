"server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { FileManagerResponse } from "./file-manager.entity";
import { getAllFiles, insertFileRecord } from "./file-manager.repository";
import { UploadFileParams } from "./types/type";

let r2ClientCache: S3Client | null = null;

function getR2Client(): S3Client {
  if (r2ClientCache) return r2ClientCache;

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Thiếu cấu hình Cloudflare R2 (ACCOUNT_ID / ACCESS_KEY_ID / SECRET_ACCESS_KEY)");
  }

  r2ClientCache = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return r2ClientCache;
}

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

function safeExtension(originalFilename: string, mimetype: string): string {
  const ext = originalFilename.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
  if (ALLOWED_EXTENSIONS.has(ext)) return ext;
  if (mimetype === "image/jpeg") return "jpg";
  if (mimetype === "image/png") return "png";
  if (mimetype === "image/webp") return "webp";
  if (mimetype === "image/gif") return "gif";
  return "bin";
}

export async function uploadImageToCloudflare(params: UploadFileParams): Promise<FileManagerResponse> {
  const { buffer, originalFilename, mimetype, userId } = params;

  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!bucket || !publicUrl) {
    throw new Error("Thiếu cấu hình Cloudflare R2 (BUCKET / PUBLIC_URL)");
  }

  const ext = safeExtension(originalFilename, mimetype);
  const generatedName = `${uuidv4()}.${ext}`;

  const r2 = getR2Client();
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: generatedName,
      Body: buffer,
      ContentType: mimetype,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const fileUrl = `${publicUrl.replace(/\/$/, "")}/${generatedName}`;

  return insertFileRecord({
    name: generatedName,
    url: fileUrl,
    originalName: originalFilename,
    fileType: mimetype,
    userId,
  });
}

export async function getAll(userId: string) {
  return getAllFiles(userId);
}
