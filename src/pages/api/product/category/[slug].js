import { responseNotFound } from '@/errors/response-error';
import { prismaClient } from '@/lib/prisma';

export default function handler(req, res) {
  if (req.method === "GET") {
    return get(req, res);
  }

  responseNotFound(res);
}

async function get(req, res) {
  try {
    const { slug } = req.query;
    const removeCategoryNameSlug = slug.split("-").join(" ");
    console.log("slug ", slug);
    console.log("removeCategoryNameSlug ", removeCategoryNameSlug);

    const findCategoryBySlug = await prismaClient.category.findFirst({
      where: {
        category_name: {
          startsWith: removeCategoryNameSlug
        }
      }
    });
    console.log("find ", findCategoryBySlug);
    if (!findCategoryBySlug) {
      res.status(200).json({
        data: []
      });
      return;
    }

    const response = await prismaClient.product.findMany({
      where: {
        category_id: findCategoryBySlug.id,
        active: "Y"
      },
      include: {
        category: {
          select: {
            category_name: true
          }
        }
      },
      orderBy: {
        id: "desc"
      },
    });

    const data = response.map(({
      category,
      ...rest
    }) => ({
      ...rest,
      category_name: category?.category_name
    }));
    res.status(200).json({
      data,
    })
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}