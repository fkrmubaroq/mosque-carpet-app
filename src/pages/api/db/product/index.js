import { responseErrorMessage, responseNotFound } from '@/errors/response-error';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import Product from '@/models/product';
import { insertProductValidation, updateProductValidation } from '@/validation/product-validation';
import { validation } from '@/validation/validation';
const product = new Product();

export default function handler(req, res) {
  if (req.method === "POST") {
    return post(req, res)
  }

  if (req.method === "GET") {
    return get(req,res);
  }
  
  if (req.method === "PUT") {
    return put(req,res);
  }

  responseNotFound(res);
}


async function put(req, res) {
  try {  
    const { id, ...validateRequest } = validation(updateProductValidation, req.body);
    console.log("vava", id, validateRequest)
    await product.updateData({
      data: validateRequest,
      where: { id }
    });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: "OK"
    })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}

async function post(req, res) {
  try {
    
    const validateRequest = validation(insertProductValidation, req.body);
    await product.insertData(validateRequest);
    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: "ok"
    })
  } catch (e) {
    responseErrorMessage(e, res);
  }
} 

async function get(req, res) {
  try {
    const queryParams = req.query;
    const products = await product.getProductWithPagination({
      ...queryParams,
    });
    res.status(200).json(products);
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}