import axios from "axios";

export const appVersao = "1.0.0";

//NOTE: IP changes on android or IOS, WARNING!
export const api = axios.create({
  baseURL: "http://192.168.0.55:3003",
});
