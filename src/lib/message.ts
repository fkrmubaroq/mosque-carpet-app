const RESPONSE_API_MESSAGE = {
  "0": "OK",
  "1": "error message",
}

const TOAST_MESSAGE = {
  // product 
  "success-insert-product": "Produk telah ditambahkan",
  "error-insert-product": "Produk Gagal ditambahkan",
}
export type TKeyToastMessage = keyof typeof TOAST_MESSAGE;
export { RESPONSE_API_MESSAGE, TOAST_MESSAGE };