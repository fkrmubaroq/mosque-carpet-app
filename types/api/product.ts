import { TResponseDataCategory } from "./category"

export type TResponseDataProduct = {
  id: number,
  name: string,
  description: string,
  price: number,
  stock: number,
  category: TResponseDataCategory
 }