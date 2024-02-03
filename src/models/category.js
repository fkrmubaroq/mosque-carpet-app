import query from "@/lib/db";

export default class Category{
  findCategoryBySlug(slug){
    const removeCategoryNameSlug = slug.split("-").join(" ");
    return query(`SELECT category.* FROM category WHERE category_name LIKE ? LIMIT 1`, [`${removeCategoryNameSlug}%`])
  }
  
}