import { getMethod } from ".";

export function getInformationIp() {
  return fetch("https://api.ipify.org?format=json");
}

export function visitorPage() {
  return getMethod("visitor");
}