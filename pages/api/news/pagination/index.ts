import type { NextApiRequest, NextApiResponse } from "next";
import { toErrorResponse } from "src/lib/api/errors";
import { withApiHandler } from "src/lib/api/withApiHandler";
import { getListNewsWithPagination } from "src/server/news/news.service";

const MAX_PAGE_SIZE = 100;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const page = clamp(Number(req.query.page) || 1, 1, Number.MAX_SAFE_INTEGER);
    const pageSize = clamp(Number(req.query.pageSize) || 10, 1, MAX_PAGE_SIZE);
    const title = typeof req.query.title === "string" ? req.query.title.slice(0, 100) : "";
    const result = await getListNewsWithPagination({ page, pageSize, title });
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ code: 200, message: "OK", ...result });
  } catch (error) {
    console.error("[PAGINATION ERROR]", error);
    const { status, body } = toErrorResponse(error);
    return res.status(status).json(body);
  }
}

export default withApiHandler(handler);
