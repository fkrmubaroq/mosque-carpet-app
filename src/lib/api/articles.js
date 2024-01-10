import { getMethod } from ".";

export function getArticles(params) {
  return getMethod("articles", { params });
}
