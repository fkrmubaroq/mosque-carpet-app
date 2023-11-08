import { TResponseDataApi } from "@/types/api";
import { postMethod } from ".";

export type TPayloadProduct = {
  name: string,
  description: string,
  price?: number,
  stock?: number,
  category_id: number,
  image?: string
}
export function insertProduct(payload:TPayloadProduct) {
  return postMethod("product",payload);
}