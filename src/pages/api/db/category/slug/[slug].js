import { responseNotFound } from "@/errors/response-error";
import Product from "@/models/product";

const product = new Product();
export default function handler(req, res) {
  if (req.method !== "GET") {
    responseNotFound(res);
    return;
  }

  getCategoryBySlug(req, res);
}

async function getCategoryBySlug(req, res) {
  try {
    const { slug } = req.query;
    const removeSlug = slug.split("-")
    const id = removeSlug[removeSlug?.length - 1];

    const data = await product.findId(id);

    res.status(200).json({
      data,
    })
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}