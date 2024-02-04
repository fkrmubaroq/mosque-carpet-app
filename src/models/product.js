import { OFFSET } from "@/lib/constant";
import query, { count, deleteRow, insert, update } from "@/lib/db";

const table = "product";
export default class Product{

  findId(id) {
    return query(`SELECT product.* FROM product WHERE product.id = ? LIMIT 1 `, [id]);
  }
  
  getProductByCategoryId(id) {
    return query(`SELECT 
      product.*, category.category_name 
        FROM product  
        LEFT JOIN category ON category.id = product.category_id 
          WHERE product.category_id = ? AND product.active = 'Y' ORDER BY product.id DESC`, [id]
    ); 
  }

  getProductNameBySlug(slug) {
    const removeSlugProductName = slug.split("-");
    const id = removeSlugProductName[removeSlugProductName?.length - 1];
    return query(`SELECT 
      product.*, category.category_name 
        FROM product  
        LEFT JOIN category ON category.id = product.category_id
          WHERE product.id = ? ORDER BY product.id DESC`, [id]
    );
  }

  async getProductWithPagination(queryParams) {
    const filters = {
      sql: "",
      values: []
    };
    const page = queryParams?.page ? +queryParams.page : 1;
    const skip = (page - 1) * OFFSET;

    if (queryParams?.name) {
      filters.sql = `WHERE product.name = ? `;
      filters.values.push(queryParams.name);
    }


    const paginationSql = `LIMIT ${OFFSET} OFFSET ${skip}`;
    const productSql = `SELECT product.*, category.category_name FROM product  LEFT JOIN category ON category.id = product.category_id ${filters.sql} ORDER BY product.id DESC`;
    const response = await query(`${productSql} ${paginationSql}`, filters.values);

    const paginationInfo = await count(`${productSql}`, filters.values);
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