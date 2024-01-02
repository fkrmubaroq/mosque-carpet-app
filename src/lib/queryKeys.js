export const productQuery = {
  category: ["product", "category"],
}

export const selectionQuery = {
  category: ["selection","category"]
}

export const adminProductQuery = {
  getAll : (page,keyword) => ["admin","product",page,keyword]
}

export const adminFileManagerQuery = {
  getFIleItems: (path) => ["admin","file-manager", path]
}