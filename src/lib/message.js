

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
  "error-update-file": "Gagal mengubah file",
  "error-upload-file": "Gagal upload file",
  "error-delete-file": "Gagal menghapus file",
  "error-download-file": "File gagal didownload",
  "success-delete-folder": "Folder telah dihapus",
  "success-delete-file": "File telah dihapus",
  "success-upload-file": "File telah diupload",
  "custom-message": "custom-message",

  // category 
  "success-insert-category": "Kategori telah ditambahkan",
  "success-update-category": "Kategori berhasil diubah",
  "success-delete-category": "Kategori telah dihapus",
  "error-insert-category": "Kategori gagal ditambahkan",
  "error-update-category": "Kategori gagal diubah",
  "error-delete-category": "Kategori gagal dihapus",

  // setting 
  "success-update-setting": "Pengaturan telah di terapkan",
  "error-update-setting": "Pengaturan gagal diterapkan",

  // sections
  "success-update-section": "Landing page telah disimpan",
  "error-update-section": "Landing page gagal disimpan",

  // articles
  "success-create-article": "Artikel telah disimpan",
  "error-create-article": "Artikel gagal disimpan",
  "success-update-article": "Artikel telah diubah",
  "error-update-article": "Artikel gagal diubah",
  "success-delete-article": "Artikel telah dihapus",
  "error-delete-article": "Artikel gagal dihapus",

  // login
  "error-wrong-password": "Username atau password salah",

  // user
  "success-delete-user": "User telah dihapus",
  "success-insert-user": "User telah ditambahkan",
  "success-update-user": "User telah diubah",
  "error-delete-user": "User gagal dihapus",
  "error-insert-user": "User gagal ditambahkan",
  "error-update-user": "User gagal diubah",
  "error-user-is-already-exists": "username telah digunakan",
  "error-logout": "gagal logout"
}

const CONFIRMATION_MESSAGE = {
  // product 
  "confirm-delete-product": "Apakah anda yakin ingin menghapus produk ini ?",

  // category
  "confirm-delete-category": "Apakah anda yakin ingin menghapus kategori ini ?",

  // logout
  "logout": "Apakah anda yakin keluar dari halaman admin ?",
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
  SlugIsNull: {
    code: 1002,
    message: "Slug tidak ditemukan"
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
  FileIsNotFound: {
    code: 1102,
    message: "File Tidak ditemukan"
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
  },
  FileAlreadyExists: {
    code: 1106,
    message: "Nama File telah digunakan"
  },
  FailedToUpdateFileName: {
    code: 1107,
    message: "File gagal di ubah"
  },
  ExtensionFileIsUnknown: {
    code: 1108,
    message: "Extension file tidak diketahui"
  },
  FailedToDeleteFile: {
    code: 1109,
    message: "File gagal di hapus"
  },

  // feature sections 1200 - 1299
  SectionIsNull: {
    code: 1200,
    message: "Section tidak boleh kosong"
  },


  // feature users 1300 - 1399
  UserIsAlreadyExists: {
    code: 1300,
    message: "Username telah digunakan"
  },
  UserNotFound: {
    code: 1301,
    message: "Username tidak ditemukan"
  },

  Unauthorized: {
    code: 403,
    message: "Unauthorized"
  },

}

export { CONFIRMATION_MESSAGE, ERROR_MESSAGE, TOAST_MESSAGE };
