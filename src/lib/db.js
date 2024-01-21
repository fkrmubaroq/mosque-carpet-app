import mysql from "serverless-mysql";
import { objectDataToQueryBind } from "./utils";
const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
});

export async function query(query, values) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}

export async function update({ table, data, where }) {
  const dataBind = Object.values(data);
  const whereBind = Object.values(where); 
  const dataUpdate = objectDataToQueryBind({ data, allValues: "?", separator: "," });
  const dataWhere = objectDataToQueryBind({ data: where, allValues: "?", separator: "AND" });
  const query = await db.query(`UPDATE ${table} SET ${dataUpdate}  WHERE ${dataWhere}`, [...dataBind, ...whereBind]);
  return query;
}