import axios from "axios";

export function request(config) {
  let instance = axios.create({
    // baseURL: "http://127.0.0.1:8888/api/private/v1/",
    baseURL: "https://www.liulongbin.top:8888/api/private/v1/",
    timeout: 10000,
  });

  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token");

    //拦截了都要返回
    return config;
  });

  return instance(config);
}
