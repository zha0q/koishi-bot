import axios from "axios";

const BASE_URL = "https://service-kfmx0t1u-1313186578.usw.apigw.tencentcs.com";

let OPENAI_KEY = "";

// axios实例
const service = axios.create({
  baseURL: BASE_URL,
  timeout: 900 * 1000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_KEY}`,
  },
});

const modify_key = (key: string) => {
  OPENAI_KEY = key;
  (service.defaults.headers as any) = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_KEY}`,
  };
};

export { service, modify_key };
