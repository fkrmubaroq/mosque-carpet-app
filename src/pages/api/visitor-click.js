import { responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import ButtonClick from "@/models/button-click";

const buttonClick = new ButtonClick();
export default function handler(req, res) {
  if (req.method !== "POST") {
    responseNotFound(res);
    return;
  }

  trackButtonClick(req, res);
}

async function trackButtonClick(req,res) {
  try {
    const ipAddress = req.headers?.["x-ip-address"];
    if (!ipAddress) {
      res.status(STATUS_MESSAGE_ENUM.Ok).json({ message: "error track" });
      return;
    }

    const isAlreadyClick = await buttonClick.isAlreadyClickToday(ipAddress);
    if (isAlreadyClick) {
      res.status(200).json({ message: "ok" });
      return;
    }
    await buttonClick.insertData({ ip_address: ipAddress });
    res.status(200).json({ message: "okay" });

  } catch (e) {
    responseErrorMessage(e, res);
  }
}