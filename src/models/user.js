import { ResponseError } from "@/errors/response-error";
import { OFFSET } from "@/lib/constant";
import query, { count, deleteRow, insert, update } from "@/lib/db";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { decodeJwt } from "@/lib/jwt";
import { ERROR_MESSAGE } from "@/lib/message";
import { getCookieServer } from "@/lib/utils";

const table = "user";
export default class User{
  findByUsername(username) {
    return query(`SELECT user.* FROM ${table} WHERE username = ?`, [username]);
  }

  async getProductWithPagination(queryParams, req) {
    const filters = {
      sql: "",
      values: []
    };
    const page = queryParams?.page ? +queryParams.page : 1;
    const skip = (page - 1) * OFFSET;

    if (queryParams?.role) {
      filters.sql = `WHERE user.role = ? `;
      filters.values.push(queryParams.role);
    }

    if (queryParams?.q) {
      const qQuery = !!filters.sql ? " AND " : "WHERE";
      filters.sql = `${qQuery} (username LIKE ? OR name LIKE ?)`;
      filters.values.push(`%${queryParams.q}%`);
      filters.values.push(`%${queryParams.q}%`);
    }

    if (!queryParams?.role) {
      const token = getCookieServer(req, "token");
      if (!token) {
        throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.Unauthorized);
      }

      const decode = decodeJwt(token);
      const user = await this.findByUsername(decode?.user);
      if (!user?.length) {
        throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.Unauthorized);
      }

      const resultData = user[0];
      if (resultData?.role !== "SUPER_ADMIN") { 
        const roleQuery = !!filters.sql ? " AND " : "WHERE";
        filters.sql = `${roleQuery} role <> 'SUPER_ADMIN'`;
      }
    }


    const paginationSql = `LIMIT ${OFFSET} OFFSET ${skip}`;
    const userSql = `SELECT user.username, user.role, user.name FROM ${table} ${filters.sql}`;
    const response = await query(`${userSql} ${paginationSql}`, filters.values);

    const paginationInfo = await count(`${userSql}`, filters.values);
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

  async usernameIsExists(username) {
    const user = await query(`SELECT user.username FROM ${table} WHERE username = ? `, [username]);
    return !!user;
  }
  insertData(data) {
    return insert({ table, data });
  }

  deleteData(where) {
    return deleteRow({ table, where });
  }

  updateData({ data, where }) {
    return update({ table, data, where })
  }
}