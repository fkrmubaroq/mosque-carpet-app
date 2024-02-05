import { getCurrentDate } from "@/lib/api/utils";
import query, { insert } from "@/lib/db";

const table = "button_clicks";
export default class ButtonClick{
  async isAlreadyClickToday(ipAddress) {
    const result = await query(`SELECT button_clicks.id FROM ${table} WHERE ip_address = ? AND click_at LIKE ? `, [ipAddress, `${getCurrentDate()}%`]);
    return !!result.length;
  }

  async getClickToday() {
    const result = await query(`SELECT button_clicks.id FROM ${table} WHERE click_at LIKE ?`, [`${getCurrentDate()}%`]);
    return result?.length || 0;
  }

  async getAllVisitorClick() {
    const result = await query(`SELECT button_clicks.id FROM ${table}`);
    return result?.length || 0;
  }

  insertData(data) {
    return insert({ table, data });
  }
}