import type { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "src/lib/api/withApiHandler";
import { updateNewsSchema } from "src/lib/api/news.schema";
import { withValidation } from "src/lib/api/withValidation";
import { deleteNewsArticle, getNewsById, updateNewsArticle } from "src/server/news/news.service";

const WRITE_ROLES = ["super_admin", "beam_admin", "sale"];

function errorStatus(err: string) {
  return err === "Không tìm thấy bài viết" ? 404 : 500;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  try {
    if (req.method === "GET") {
      const result = await getNewsById(id as string);
      return res.status(200).json(result);
    }
    if (req.method === "PUT") {
      return withValidation(updateNewsSchema, async (req, res) => {
        const result = await updateNewsArticle(id as string, req.body);
        return res.status(200).json(result);
      })(req, res);
    }
    if (req.method === "DELETE") {
      await deleteNewsArticle(id as string);
      return res.status(200).json({ code: 200, message: "OK" });
    }
    return res.status(405).end();
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    res.status(errorStatus(err)).json({ success: false, message: err });
  }
}

export default withApiHandler(handler, WRITE_ROLES);
