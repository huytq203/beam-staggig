import type { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "src/lib/api/withApiHandler";
import { showIsHotNewArticle } from "src/server/news/news.service";

const WRITE_ROLES = ["super_admin", "beam_admin", "sale"];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).end();
  const { id } = req.query;
  try {
    const result = await showIsHotNewArticle(id as string);
    return res.status(200).json(result);
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    const status = err === "Không tìm thấy bài viết" ? 404 : 500;
    res.status(status).json({ success: false, message: err });
  }
}

export default withApiHandler(handler, WRITE_ROLES);
