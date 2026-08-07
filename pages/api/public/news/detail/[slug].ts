import type { NextApiRequest, NextApiResponse } from "next";
import { NotFoundError } from "src/lib/api/errors";
import { publicError, publicOk, withPublicApiHandler } from "src/lib/api/withPublicApiHandler";
import { getPublicNewsBySlug } from "src/server/news/news.service";

/**
 * Thay thế `GET /news/detail/{slug}` của BE cũ (core.devops.beamewa.com.vn).
 * Được map từ `/news/detail/:slug` qua rewrite trong next.config.js.
 *
 * Bài không tồn tại / đang ẩn / DRAFT đều trả 404 với đúng payload cũ:
 * {"message":"NEWS_ARTICLE_NOT_FOUND","data":null,"code":404}
 */

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 255;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const slug = req.query.slug;
    if (typeof slug !== "string" || slug.length > MAX_SLUG_LENGTH || !SLUG_REGEX.test(slug)) {
      throw new NotFoundError();
    }

    const result = await getPublicNewsBySlug(slug);

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(publicOk(result));
  } catch (error) {
    res.setHeader("Cache-Control", "no-store");
    if (error instanceof NotFoundError) {
      return res.status(404).json(publicError("NEWS_ARTICLE_NOT_FOUND", 404));
    }
    console.error("[PUBLIC NEWS DETAIL ERROR]", error);
    return res.status(500).json(publicError("INTERNAL_ERROR", 500));
  }
}

export default withPublicApiHandler(handler);
