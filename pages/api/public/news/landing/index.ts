import type { NextApiRequest, NextApiResponse } from "next";
import { publicError, publicOk, withPublicApiHandler } from "src/lib/api/withPublicApiHandler";
import { getPublicNewsList } from "src/server/news/news.service";

/**
 * Thay thế `GET /news/landing` của BE cũ (core.devops.beamewa.com.vn).
 * Được map từ `/news/landing` qua rewrite trong next.config.js.
 *
 * Contract phải giữ nguyên: envelope `{message, data, code}` với `data` là
 * payload Spring Page. `page` nhận vào là 1-based, `data.number` trả về 0-based.
 */

const MAX_SIZE = 100;
const MAX_NAME_LENGTH = 100;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const page = clamp(Number(req.query.page) || 1, 1, Number.MAX_SAFE_INTEGER);
    const size = clamp(Number(req.query.size) || 10, 1, MAX_SIZE);
    const name =
      typeof req.query.name === "string" ? req.query.name.slice(0, MAX_NAME_LENGTH) : "";

    const result = await getPublicNewsList({ name, page, size });

    // Nội dung công khai, đổi ít → cho CDN/proxy của landing cache được.
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(publicOk(result));
  } catch (error) {
    console.error("[PUBLIC NEWS LANDING ERROR]", error);
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json(publicError("INTERNAL_ERROR", 500));
  }
}

export default withPublicApiHandler(handler);
