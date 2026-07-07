import axios from "axios";
import https from "https";
import type { NextApiRequest, NextApiResponse } from "next";

const SERVICE_MAP: Record<string, string> = {
  "beam-api":     process.env.NEXT_PUBLIC_BEAM_API_DIRECT!,
  "core":         process.env.NEXT_PUBLIC_API_CORE_DIRECT!,
  "core2":        process.env.NEXT_PUBLIC_API_CORE2_DIRECT!,
  "payment":      process.env.NEXT_PUBLIC_API_PAYMENT_DIRECT!,
  "notification": process.env.NEXT_PUBLIC_API_NOTIFICATION_DIRECT!,
};

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const SKIP_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "transfer-encoding",
  "content-encoding",
  "origin",
  "referer",
]);

function readRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks as unknown as Uint8Array[])));
    req.on("error", reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const segments = req.query.path as string[];
  const [service, ...rest] = segments;
  const targetBase = SERVICE_MAP[service];

  if (!targetBase) {
    return res.status(404).json({ success: false, message: `Proxy service không tồn tại: ${service}` });
  }

  const query = { ...req.query };
  delete query.path;
  const qs = new URLSearchParams(query as Record<string, string>).toString();
  const targetUrl = `${targetBase}/${rest.join("/")}${qs ? `?${qs}` : ""}`;

  const forwardHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!SKIP_HEADERS.has(key.toLowerCase()) && typeof value === "string") {
      forwardHeaders[key] = value;
    }
  }
  forwardHeaders["host"] = new URL(targetBase).host;

  // Đọc raw body để giữ nguyên multipart/form-data
  const isGet = ["GET", "HEAD"].includes(req.method ?? "");
  const rawBody = isGet ? undefined : await readRawBody(req);

  try {
    const response = await axios({
      method: req.method as any,
      url: targetUrl,
      headers: forwardHeaders,
      data: rawBody,
      httpsAgent,
      validateStatus: () => true,
      responseType: "arraybuffer",
      timeout: 60_000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    for (const [key, value] of Object.entries(response.headers)) {
      if (!SKIP_HEADERS.has(key.toLowerCase()) && value !== undefined) {
        res.setHeader(key, value as string | string[]);
      }
    }

    res.status(response.status).send(response.data);
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    res.status(502).json({ success: false, message: `Proxy error: ${err}` });
  }
}

export const config = {
  api: {
    bodyParser: false,   // tắt để giữ raw stream (multipart/form-data hoạt động)
    responseLimit: false,
    externalResolver: true,
  },
};
