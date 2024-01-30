import { responseErrorMessage } from "@/errors/response-error";
import { setHeaderCookie } from "@/lib/api/utils";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return;
    }

    setHeaderCookie("", res, -1);
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ message: "ok" });
  } catch (e) {
    responseErrorMessage(e, res);
  }

}