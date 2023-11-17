

const TOAST_MESSAGE = {
  // product 
  "success-insert-product": "Produk telah ditambahkan",
  "success-delete-product": "Produk telah dihapus",
  "success-update-product": "Produk berhasil diubah",
  "error-insert-product": "Produk Gagal ditambahkan",
  "error-delete-product": "Produk gagal dihapus",
  "error-update-product": "Produk gagal diubah",
  
  // file manager
  "error-create-folder": "Gagal membuat folder",
  "custom-message": "custom-message",
}

const CONFIRMATION_MESSAGE = {
  // product 
  "confirm-delete-product": "Apakah anda yakin ingin menghapus produk ini ?",
}

const ERROR_MESSAGE = {
  // feature products 1000 - 1099
  UsernameOrPasswordWrong: {
    code: 1000,
    message: "Username atau password salah"
  },
  ProductIdIsNull: {
    code: 1001,
    message: "Product tidka ditemukan"
  },
  // feature file manager 1100 - 1199
  FolderAlreadyExists: {
    code: 1100,
    message: "Nama Folder telah digunakan"
  },

}
type TKeyToastMessage = keyof typeof TOAST_MESSAGE;
type TKeyConfirmation = keyof typeof CONFIRMATION_MESSAGE;
export { CONFIRMATION_MESSAGE, TOAST_MESSAGE, ERROR_MESSAGE };
export type { TKeyToastMessage, TKeyConfirmation }