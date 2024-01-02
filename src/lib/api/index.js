import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const instance = axios.create({
  withCredentials: true,
  baseURL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export function getMethod(endpoint, config){
  return instance.get(endpoint, config);
}

export function postMethod(endpoint, payload, config){
  return instance.post(endpoint, payload, config);
}

export function putMethod(endpoint, payload, config) {
  return instance.put(endpoint, payload, config);
}
export function patchMethod(endpoint, payload, config) {
  return instance.patch(endpoint, payload, config);
}

export function deleteMethod(endpoint, config){
  return instance.delete(endpoint, config);
}


export { instance };

