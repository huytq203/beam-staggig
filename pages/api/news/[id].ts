import type { NextApiRequest, NextApiResponse } from "next";
import { deleteNewsArticle, getNewsById, updateNewsArticle } from "src/server/news/news.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  try {
    if (req.method === "GET") {
      const result = await getNewsById(id as string);
      return res.status(200).json(result);
    }
    if (req.method === "PUT") {
      const result = await updateNewsArticle(id as string, req.body);
      return res.status(200).json(result);
    }
    if (req.method === "DELETE") {
      await deleteNewsArticle(id as string);
      return res.status(204).json({ code: 200, message: "OK" });
    }
    return res.status(405).end();
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    const status = err === "Không tìm thấy bài viết" ? 404 : 500;
    res.status(status).json({ success: false, message: err });
  }
}
