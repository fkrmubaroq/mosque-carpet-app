

const TOAST_MESSAGE = {
  // product 
  "success-insert-product": "Produk telah ditambahkan",
  "success-delete-product": "Produk telah dihapus",
  "success-update-product": "Produk berhasil diubah",
  "error-insert-product": "Produk Gagal ditambahkan",
  "error-delete-product": "Produk gagal dihapus",
  "error-update-product": "Produk gagal diubah",
  
  "custom-message": "custom-message",
}

const CONFIRMATION_MESSAGE = {
  // product 
  "confirm-delete-product": "Apakah anda yakin ingin menghapus produk ini ?",
}

type TKeyToastMessage = keyof typeof TOAST_MESSAGE;
type TKeyConfirmation = keyof typeof CONFIRMATION_MESSAGE;
export { CONFIRMATION_MESSAGE, TOAST_MESSAGE };
export type { TKeyToastMessage, TKeyConfirmation }