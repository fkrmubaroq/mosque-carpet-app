import query, { update } from "@/lib/db";
import { QueryTypes } from "sequelize";

export class Setting{

  get() {
    return query("SELECT * FROM setting LIMIT 1", { type: QueryTypes.SELECT });
  }

  update(data, where) {
    return update({ table: "setting", data: data, where });
  }
}