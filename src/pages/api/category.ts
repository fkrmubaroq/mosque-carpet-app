import { responseErrorMessage } from '@/errors/response-error'
import { STATUS_MESSAGE_ENUM } from '@/lib/enum'
import { prismaClient } from '@/lib/prisma'
import { TResponseDataCategory } from '@/lib/api/category'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": getCategory(req,res)
  }
}
async function getCategory(req: NextApiRequest, res: NextApiResponse<{ data: TResponseDataCategory[] }>) {
  try { 
    const data = await prismaClient.category.findMany({});
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e: any) {
    responseErrorMessage(e, res);
  }
} 