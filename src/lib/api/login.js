import { postMethod } from ".";

export function loginAdmin(payload) {
  return postMethod("login", payload);
}