import type { NextApiRequest, NextApiResponse } from "next";
import { toErrorResponse } from "src/lib/api/errors";
import { withApiHandler } from "src/lib/api/withApiHandler";
import { getAll } from "src/server/file-manager/file-manager.service";

const READ_ROLES = ["super_admin", "beam_admin", "sale"];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const userId = req.user!.sub;
    const result = await getAll(userId);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ code: 200, message: "OK", data: result });
  } catch (error) {
    console.error("[FILE GET-ALL ERROR]", error);
    const { status, body } = toErrorResponse(error);
    return res.status(status).json(body);
  }
}

export default withApiHandler(handler, READ_ROLES);
