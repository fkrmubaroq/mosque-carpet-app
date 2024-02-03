import { responseNotFound } from '@/errors/response-error';
import Product from '@/models/product';
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

    const data = await product.getProductNameBySlug(slug);

    res.status(200).json({
      data
    })
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}