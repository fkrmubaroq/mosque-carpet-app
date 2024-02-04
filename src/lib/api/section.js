import { getMethod, putMethod } from ".";

export function updateSections(payload, config) {
  return putMethod("sections", payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export function getAllSection(params) {
  return getMethod("sections",{ params })
}