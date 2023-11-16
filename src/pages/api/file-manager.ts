import { responseErrorMessage } from '@/errors/response-error'
import { STATUS_MESSAGE_ENUM } from '@/lib/enum'
import { prismaClient } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": getAllFile(req,res)
  }
}
async function getAllFile(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = req.query;
    console.log("query", query);
    const path = query?.path ? String(query?.path) : "/";
    // console.log("path ", path);
    const data = await prismaClient.fileManager.findMany({
      where: {
        path
      }
    });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e: any) {
    responseErrorMessage(e, res);
  }
} 