import { responseErrorMessage } from '@/errors/response-error';
import { prismaClient } from "@/lib/prisma";

export async function get(req, res) {
  try {
    const data = await prismaClient.setting.findFirst();
    // res.status(STATUS_MESSAGE_ENUM.Ok).json({ asd:"ads" })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}
