"server-only";

import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { ObjectSchema } from "yup";

export function withValidation(schema: ObjectSchema<any>, handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: err.inner?.map((e: any) => ({ field: e.path, message: e.message })),
      });
    }
    return handler(req, res);
  };
}
