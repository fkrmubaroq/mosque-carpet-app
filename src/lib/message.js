

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
  "error-update-folder": "Gagal mengubah folder",
  "success-delete-folder": "Folder telah dihapus",
  "error-upload-file": "Gagal upload file",
  "success-upload-file": "File telah diupload",
  "custom-message": "custom-message",
}

const CONFIRMATION_MESSAGE = {
  // product 
  "confirm-delete-product": "Apakah anda yakin ingin menghapus produk ini ?",

  "costum-message": "custom-message"
}

const ERROR_MESSAGE = {
  // feature products 1000 - 1099
  UsernameOrPasswordWrong: {
    code: 1000,
    message: "Username atau password salah"
  },
  ProductIdIsNull: {
    code: 1001,
    message: "Id tidak ditemukan"
  },
  // feature file manager 1100 - 1199
  FolderAlreadyExists: {
    code: 1100,
    message: "Nama Folder telah digunakan"
  },
  FolderIsNotFound: {
    code: 1101,
    message: "Folder tidak ditemukan"
  },
  
  FailedToUpdateFolderName: {
    code: 1103,
    message: "Folder gagal di ubah"
  },
  FailedToDeleteFolder: {
    code: 1104,
    message: "Folder gagal di hapus"
  },
  FailedToUploadFile: {
    code: 1105,
    message: "File gagal diupload"
  }
}

export { CONFIRMATION_MESSAGE, ERROR_MESSAGE, TOAST_MESSAGE };
