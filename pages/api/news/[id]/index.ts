import type { NextApiRequest, NextApiResponse } from "next";
import { BadRequestError, toErrorResponse } from "src/lib/api/errors";
import { updateNewsSchema } from "src/lib/api/news.schema";
import { withApiHandler } from "src/lib/api/withApiHandler";
import { withValidation } from "src/lib/api/withValidation";
import { deleteNewsArticle, getNewsById, updateNewsArticle } from "src/server/news/news.service";

const WRITE_ROLES = ["super_admin", "beam_admin", "sale"];
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getId(req: NextApiRequest): string {
  const id = req.query.id;
  if (typeof id !== "string" || !UUID_REGEX.test(id)) {
    throw new BadRequestError("ID không hợp lệ");
  }
  return id;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = getId(req);

    if (req.method === "GET") {
      const result = await getNewsById(id);
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ code: 200, message: "OK", data: result });
    }
    if (req.method === "PUT") {
      return withValidation(updateNewsSchema, async (req, res) => {
        const userId = req.user!.sub;
        const result = await updateNewsArticle(id, req.body, userId);
        return res.status(200).json({ code: 200, message: "OK", data: result });
      })(req, res);
    }
    if (req.method === "DELETE") {
      await deleteNewsArticle(id);
      return res.status(200).json({ code: 200, message: "OK" });
    }
    return res.status(405).end();
  } catch (error) {
    console.error("[NEWS ID ERROR]", error);
    const { status, body } = toErrorResponse(error);
    return res.status(status).json(body);
  }
}

export default withApiHandler(handler, WRITE_ROLES);
