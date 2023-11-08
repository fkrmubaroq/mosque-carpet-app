import { RESPONSE_API_MESSAGE } from '@/lib/message'
import { prismaClient } from '@/lib/prisma'
import { ApiMessage, TResponseDataApi } from '@/types/api'
import { TResponseDataCategory } from '@/types/api/category'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": getCategory(req,res)
  }
}
async function getCategory(req: NextApiRequest, res: NextApiResponse<TResponseDataApi<TResponseDataCategory[]>>) {
  const data = await prismaClient.category.findMany({});

  res.status(200).json({
    code: +ApiMessage.StatusOk,
    message: RESPONSE_API_MESSAGE[ApiMessage.StatusOk],
    data
  })
} 