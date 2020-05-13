import axios from "axios";

export function request(config) {
  let instance = axios.create({
    baseURL: "https://www.liulongbin.top:8888/api/private/v1/",
    timeout: 10000,
  });

  return instance(config);
}
