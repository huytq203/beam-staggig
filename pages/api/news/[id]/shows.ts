import type { NextApiRequest, NextApiResponse } from "next";
import { BadRequestError, toErrorResponse } from "src/lib/api/errors";
import { withApiHandler } from "src/lib/api/withApiHandler";
import { showNewsArticle } from "src/server/news/news.service";

const WRITE_ROLES = ["super_admin", "beam_admin", "sale"];
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).end();
  try {
    const id = req.query.id;
    if (typeof id !== "string" || !UUID_REGEX.test(id)) throw new BadRequestError("ID không hợp lệ");
    const result = await showNewsArticle(id);
    return res.status(200).json({ code: 200, message: "OK", data: result });
  } catch (error) {
    console.error("[SHOWS ERROR]", error);
    const { status, body } = toErrorResponse(error);
    return res.status(status).json(body);
  }
}

export default withApiHandler(handler, WRITE_ROLES);
