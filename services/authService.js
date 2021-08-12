const keyName = "jwtToken";

function getToken() {
  return localStorage.getItem(keyName);
}

function storeToken(token) {
  localStorage.setItem(keyName, token);
}

function removeToken() {
  localStorage.removeItem(keyName);
}

export default {
  getToken,
  storeToken,
  removeToken,
};
