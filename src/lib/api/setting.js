import { putMethod } from ".";

export function updateSetting(payload) {
  return putMethod("setting", payload);
}
