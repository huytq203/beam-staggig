import axios from "axios";
import https from "https";
import type { NextApiRequest, NextApiResponse } from "next";

const KINDS = new Set(["transactions", "tickets"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FILE_NAME = "Phiếu yêu cầu tạm ứng tiền lương.pdf";
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { kind, id } = req.query as Record<string, string>;
  const token = req.cookies?.ACCESS_TOKEN;
  if (!token) return res.status(401).json({ message: "UNAUTHORIZED" });
  if (!KINDS.has(kind) || !UUID.test(id)) {
    return res.status(404).json({ message: "Not found" });
  }
  const base = process.env.NEXT_PUBLIC_API_PAYMENT_DIRECT;
  try {
    const response = await axios.get(
      `${base}/payment/reporting/${kind}/${id}/request-form`,
      {
        headers: { Authorization: `Bearer ${token}` },
        httpsAgent,
        validateStatus: () => true,
        timeout: 60_000,
      },
    );
    const pdfBase64 = response.data?.data?.pdfBase64;
    if (response.status !== 200 || !pdfBase64) {
      return res.status(response.status === 200 ? 404 : response.status).json({
        message: response.data?.message || "Không tải được phiếu ứng lương",
      });
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="phieu-yeu-cau-tam-ung-tien-luong.pdf"; filename*=UTF-8''${encodeURIComponent(
        FILE_NAME,
      )}`,
    );
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).send(Buffer.from(pdfBase64, "base64"));
  } catch (e) {
    return res.status(502).json({ message: "Không tải được phiếu ứng lương" });
  }
}
