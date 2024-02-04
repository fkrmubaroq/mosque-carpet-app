import query, { update } from "@/lib/db";

export class Setting{

  get() {
    return query("SELECT * FROM setting LIMIT 1");
  }

  updateData(data, where) {
    return update({ table: "setting", data: data, where });
  }
}