import query, { update } from "@/lib/db";

const table = "sections";
export default class Section{
  getAll(queryParams) {
    let limitSql = "";
    if (queryParams?.limit) {
      limitSql = `LIMIT ${queryParams.limit}`;
    }
    return query(`SELECT sections.* FROM ${table} ORDER BY position ASC ${limitSql}`);
  }
  updateData({ data, where }) {
    return update({ table , data, where });
  }
}