import { OFFSET } from "@/lib/constant";
import query, { count, deleteRow, insert, update } from "@/lib/db";

const table = "category";
export default class Category{

  get(queryParams){
    const filters = {
      sql: "",
      values: []
    };
    if (queryParams?.id) {
      filters.sql = `WHERE category.id = ? `;
      filters.values.push(queryParams.id);
    }

    return query(`SELECT category.* FROM ${table} ${filters.sql}`, filters.values);
  }

  async getCategoryWithPagination(queryParam) {
    const filters = {
      sql: "",
      values: []
    };

    const page = queryParam?.page ? +queryParam.page : 1;
    const offset = (page - 1) * OFFSET;
    const limit = queryParam?.limit || OFFSET;

    if (queryParam?.name) {
      filters.sql = `WHERE category.category_name LIKE ?`;
      filters.values.push(`${queryParam.name}%`);
    }

    const paginationSql = `LIMIT ${limit} OFFSET ${offset}`;
    const categorySql = `SELECT category.* FROM ${table} ${filters.sql} ORDER BY id DESC `;
    const response = await query(`${categorySql} ${paginationSql}`, filters.values);

    const paginationInfo = await count(`${categorySql}`, filters.values);
    const totalPage = Math.ceil(paginationInfo / OFFSET)
    return {
      data: response,
      paging: {
        page,
        total_page: totalPage,
        total_items: paginationInfo
      }
    }
  }

  findCategoryBySlug(slug){
    const removeCategoryNameSlug = slug.split("-").join(" ");
    return query(`SELECT category.* FROM ${table} WHERE category_name LIKE ? LIMIT 1`, [`${removeCategoryNameSlug}%`])
  }
  
  insertData(data) {
    return insert({ table, data });
  }

  updateData({ data, where }) {
    return update({ table, data, where })
  }

  deleteData(where) {
    return deleteRow({ table, where });
  }
}