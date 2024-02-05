import { postMethod } from ".";

export function getInformationIp() {
  return fetch("https://api.ipify.org?format=json");
}

export function visitorPage(payload, ipAddress) {
  return postMethod("visitor", payload, {
    headers: {
      'X-Ip-Address': ipAddress
    }
  });
}

export function visitorClick(ipAddress) {
  return postMethod("visitor-click", {}, {
    headers: {
      'X-Ip-Address': ipAddress
    }
  });
}