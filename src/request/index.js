import axios from "axios";

export function request(config) {
  let instance = axios.create({
    baseURL: "http://127.0.0.1:8888/api/private/v1/",
    timeout: 10000,
  });

  return instance(config);
}
