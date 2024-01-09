import { postMethod } from ".";

export function insertSetting(payload) {
  return postMethod("setting", payload);
}
