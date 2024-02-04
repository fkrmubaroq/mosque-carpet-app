import { OFFSET } from "@/lib/constant";
import query, { count, deleteRow, insert, update } from "@/lib/db";

const table = "article";
export default class Article{

  findId(id) {
    return query(`SELECT article.* FROM ${table} WHERE id = ?`, [id]);  
  }

  articleContainSlug(slug) {
    return query(`SELECT article.* FROM ${table} WHERE article.slug = ?`,[slug])
  }

  async getArticleWithPagination(queryParams) {
    const filters = {
      sql: "",
      values: []
    };
    const page = queryParams?.page ? +queryParams.page : 1;
    const skip = (page - 1) * OFFSET;

    if (queryParams?.q) {
      filters.sql = `WHERE article.title LIKE ? OR article.writer LIKE ? `;
      filters.values.push(`%${queryParams.q}%`);
      filters.values.push(`%${queryParams.q}%`);
    }

    const paginationSql = `LIMIT ${OFFSET} OFFSET ${skip}`;
    const productSql = `SELECT article.* FROM ${table} ${filters.sql} ORDER BY article.id DESC`;
    const data = await query(`${productSql} ${paginationSql}`, filters.values);
    const paginationInfo = await count(`${productSql}`, filters.values);
    const totalPage = Math.ceil(paginationInfo / OFFSET)

    return {
      data,
      paging: {
        page,
        total_page: totalPage,
        total_items: paginationInfo
      }
    }
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