import type { NextApiRequest, NextApiResponse } from "next";
import { createNewsSchema } from "src/lib/api/news.schema";
import { withApiHandler } from "src/lib/api/withApiHandler";
import { withValidation } from "src/lib/api/withValidation";
import { createNewArticle, getListNews } from "src/server/news/news.service";

const WRITE_ROLES = ["super_admin", "beam_admin", "sale"];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const result = await getListNews();
      return res.status(200).json(result);
    }
    if (req.method === "POST") {
      return withValidation(createNewsSchema, async (req, res) => {
        const result = await createNewArticle(req.body);
        return res.status(201).json(result);
      })(req, res);
    }
    return res.status(405).end();
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message: err });
  }
}

export default withApiHandler(handler, WRITE_ROLES);
