import type { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "src/lib/api/withApiHandler";
import { getListNewsWithPagination } from "src/server/news/news.service";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const title = (req.query.title as string) || "";
    const result = await getListNewsWithPagination({ page, pageSize, title });
    res.status(200).json(result);
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message: err });
  }
}

export default withApiHandler(handler);
