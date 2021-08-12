import axios from "axios";
import auth from "../services/authService";

const baseURL = "https://training-institute-app.herokuapp.com";

let token = auth.getToken();
function get(url) {
  return axios.get(baseURL + url, {
    headers: { Authorization: "bearer " + token },
  });
}

function post(url, obj) {
  return url === "/user"
    ? axios.post(baseURL + url, obj)
    : axios.post(baseURL + url, obj, {
        headers: { Authorization: "bearer " + token },
      });
}

export default {
  get,
  post,
};
