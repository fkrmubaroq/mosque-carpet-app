import query, { update } from "@/lib/db";

export class Setting{

  async get() {
    const result = await query("SELECT * FROM setting LIMIT 1");
    return result?.[0] || null;
  }

  updateData(data, where) {
    return update({ table: "setting", data: data, where });
  }
}