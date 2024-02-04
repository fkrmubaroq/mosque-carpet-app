import query, { count, deleteRow, insert, update } from "@/lib/db";

const table = "file_manager"
export default class FileManager {

  findIdAndPath(id, path) {
    return query(`SELECT file_manager.* FROM ${table} WHERE id = ? AND path = ? LIMIT 1`, [id, path])
  }
  findId(id) {
    return query(`SELECT file_manager.* FROM ${table} WHERE id = ? LIMIT 1`, [id])
  }
  findPathContains(path) {
    return query(`SELECT file_manager.* FROM ${table} WHERE path LIKE ?`, [`${path}%`])
  }
  getAll(path) {
    return query(`SELECT file_manager.* FROM ${table} WHERE path = ? ORDER BY file_manager.type DESC `, [path])
  }

  insertData(data) {
    return insert({ table, data });
  }

  countFileContains(fileName) {
    return count(`SELECT file_manager.id FROM ${table} WHERE file_manager.name LIKE ?`, [`${fileName}%`]);
  }
  countByPathAndFileName(path, name) {
    return count(`SELECT file_manager.id FROM ${table} WHERE file_manager.path = ? AND file_manager.name = ? `,[path, name]);
  }
  deleteData(where) {
    return deleteRow({ table, where });
  }
  updateData({ data, where }) {
    return update({ table, data, where })
  }
}