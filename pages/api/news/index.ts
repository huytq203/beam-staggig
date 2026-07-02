import type { NextApiRequest, NextApiResponse } from "next";
import { toErrorResponse } from "src/lib/api/errors";
import { createNewsSchema } from "src/lib/api/news.schema";
import { withApiHandler } from "src/lib/api/withApiHandler";
import { withValidation } from "src/lib/api/withValidation";
import { createNewArticle, getListNews } from "src/server/news/news.service";

const WRITE_ROLES = ["super_admin", "beam_admin", "sale"];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const result = await getListNews();
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ code: 200, message: "OK", data: result });
    }
    if (req.method === "POST") {
      return withValidation(createNewsSchema, async (req, res) => {
        const username = req.user!.preferred_username ?? req.user!.sub;
        const result = await createNewArticle(req.body, username);
        return res.status(200).json({ code: 200, message: "OK", data: result });
      })(req, res);
    }
    return res.status(405).end();
  } catch (error) {
    console.error("[NEWS ERROR]", error);
    const { status, body } = toErrorResponse(error);
    return res.status(status).json(body);
  }
}

export default withApiHandler(handler, WRITE_ROLES);
