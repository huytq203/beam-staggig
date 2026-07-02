import { fromBuffer } from "file-type";
import formidable from "formidable";
import fs from "fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { BadRequestError } from "src/lib/api/errors";
import { withApiHandler } from "src/lib/api/withApiHandler";
import { toErrorResponse } from "src/lib/api/errors";
import { uploadImageToCloudflare } from "src/server/file-manager/file-manager.service";

const WRITE_ROLES = ["super_admin", "beam_admin", "sale"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const config = {
  api: { bodyParser: false, sizeLimit: false },
};

function parseForm(req: NextApiRequest): Promise<{ files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      filter: ({ mimetype }) => !!mimetype && ALLOWED_MIME.has(mimetype),
    });
    form.parse(req, (err, _fields, files) => {
      if (err) reject(err);
      else resolve({ files });
    });
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const userId = req.user!.sub;
  let tempFilePath: string | undefined;

  try {
    const { files } = await parseForm(req);
    const raw = files.file;
    const file = Array.isArray(raw) ? raw[0] : raw;

    if (!file) throw new BadRequestError("Không tìm thấy file trong request");
    tempFilePath = file.filepath;

    if (!file.mimetype || !ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestError("Định dạng file không được phép");
    }

    const buffer = await fs.readFile(file.filepath);

    const detected = await fromBuffer(buffer);
    if (!detected || !ALLOWED_MIME.has(detected.mime)) {
      throw new BadRequestError("Nội dung file không khớp với định dạng khai báo");
    }

    const result = await uploadImageToCloudflare({
      buffer,
      originalFilename: file.originalFilename ?? `upload.${detected.ext}`,
      mimetype: detected.mime,
      userId,
    });

    return res.status(200).json({ code: 200, message: "OK", data: result });
  } catch (error) {
    console.error("[UPLOAD ERROR]", error);
    const { status, body } = toErrorResponse(error);
    return res.status(status).json(body);
  } finally {
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {});
    }
  }
}

export default withApiHandler(handler, WRITE_ROLES, {
  rateLimit: { capacity: 10, refillPerSecond: 10 / 60, scope: "upload" }, // 10 uploads / phút
});
