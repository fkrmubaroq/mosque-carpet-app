export const productQuery = {
  category: ["product", "category"],
}

export const selectionQuery = {
  category: ["selection","category"]
}

export const adminProductQuery = {
  getAll : (page,keyword) => ["admin","product",page,keyword]
}
export const adminCategoryQuery = {
  getAll : (page,keyword) => ["admin","category",page,keyword]
}

export const adminFileManagerQuery = {
  getFIleItems: (path) => ["admin", "file-manager", path],
  modalGetFileItems: (path) => ["modal", "file-manager", path]
}

export const adminArticleQuery = {
  getAll: (page,keyword) => ["admin", "article",page, keyword],
  getDetail: (id) => ["admin", "article", id]
}

export const adminUsersQuery = {
  getAll: (page, keyword) => ["admin", "users", page, keyword],
  userData: ["user","data"]
}

export const landingPageQuery = {
  getCategories: ["lp", "category"],
  getArticles: ["lp", "articles"],
  getAllArticles: ["all", "articles"],
  informationIp: ["ip-address"],
  visitorPage: ["visitor-page"],
  buttonclick: ["button-click"]
}
export const collectionsQuery = {
  getCategories: ["collections"]
}
export const productsQuery = {
  getProducts: ["products-category"],
  detailProduct: (slug) => ["products-detail", slug],
  similarCategory: (slug) => ["similar-category", slug]
}

export const settingQuery = {
  admin: ["admin-setting"]
}