import { responseNotFound } from '@/errors/response-error';
import Category from '@/models/category';
import Product from '@/models/product';
const category = new Category();
const product = new Product();

export default function handler(req, res) {
  if (req.method === "GET") {
    return get(req, res);
  }

  responseNotFound(res);
}

async function get(req, res) {
  try {
    const { slug } = req.query;

    const findCategoryBySlug = await category.findCategoryBySlug(slug);
    if (!findCategoryBySlug.length) {
      res.status(200).json({
        data: []
      });
      return;
    }

    const categoryId = findCategoryBySlug[0].id;
    const data = await product.getProductByCategoryId(categoryId);
    res.status(200).json({
      data,
    })
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}