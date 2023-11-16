export const productQuery = {
  category: ["product", "category"],
}

export const selectionQuery = {
  category: ["selection","category"]
}

export const adminProductQuery = {
  getAll : (page:number,keyword:string) => ["admin","product",page,keyword]
}

export const adminFileManagerQuery = {
  getFIleItems: (path:string) => ["admin","file-manager", path]
}