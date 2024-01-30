import { getMethod, putMethod } from ".";

export function updateSetting(payload) {
  return putMethod("setting", payload);
}

export function getSetting(payload) {
  return getMethod("setting", payload);
}
