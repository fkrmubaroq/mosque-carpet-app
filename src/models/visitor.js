import { getCurrentDate } from "@/lib/api/utils";
import query, { insert } from "@/lib/db";
import { TRACK_PAGE } from "@/lib/enum";

const table = "visitor_page";
export default class Visitor{

  async getVisitorByTitle() {
    const results = await query(`SELECT 
      (SELECT COUNT(visitor_page.id) FROM visitor_page
          WHERE visitor_page.type = 'ARTICLE' AND visitor_page.article_id = article.id
      ) AS total_visitor,
      article.title,
      article.writer,
      article.thumbnail
    FROM article ORDER BY total_visitor DESC LIMIT 10`);
    return results || [];
  }

  async getVisitorToday(type) {
    const sqlVisitor = `SELECT visitor_page.* FROM ${table}`;
    if (type === TRACK_PAGE.LandingPage) {
      const result = await query(`${sqlVisitor} WHERE type = ? AND visit_at LIKE ?`, [TRACK_PAGE.LandingPage, `${getCurrentDate()}%`]);
      return result?.length || 0;
    }    
    const result = await query(`${sqlVisitor} WHERE type = ? AND visit_at LIKE ?`, [TRACK_PAGE.Article,`${getCurrentDate()}%`]);
    return result?.length || 0;
  }

  async getAllVisitor(type) {
    
    const sqlVisitor = `SELECT visitor_page.* FROM ${table}`;
    if (type === TRACK_PAGE.LandingPage) { 
      const result = await query(`${sqlVisitor}  WHERE type = ?`, [TRACK_PAGE.LandingPage]);
      return result?.length || 0;
    }

    const result = await query(`${sqlVisitor} WHERE type = ? `, [TRACK_PAGE.Article]);
    return result?.length || 0;
  }

  async isAlreadyVisitToday(type, ip, articleId) {
    const filters = {
      sql: "",
      values: []
    }

    filters.sql = `WHERE ip_address = ? `;
    filters.values.push(ip);
    if (articleId) {
      filters.sql += `AND article_id = ? `;
      filters.values.push(articleId);
    }

    if (type === TRACK_PAGE.LandingPage) {
      filters.sql += `AND article_id IS NULL `;
    }

    filters.sql += `AND visit_at LIKE ?`;
    filters.values.push(`${getCurrentDate()}%`);

    const result = await query(`SELECT visitor_page.* FROM ${table} ${filters.sql}`, filters.values);
    return !!result.length;
  }
  insertData(data) {
    return insert({ table, data });
  }
}
