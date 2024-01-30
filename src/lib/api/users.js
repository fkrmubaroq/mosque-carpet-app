import { deleteMethod, getMethod, postMethod, putMethod } from ".";
export function getUsers(params) {
  return getMethod("user", { params });
}
export function insertUser(payload) {
  return postMethod("user", payload);
}
export function deleteUser(id) {
  return deleteMethod(`user/${id}`);
}

export function updateUser(username, payload) {
  return putMethod(`user/${username}`, payload);
}

export function getUserLogin() {
  return getMethod("user/login");
}

export function logout() {
  return postMethod("logout");
}