import axios from "axios";
import { BASE_URL } from "./url";
import { getToken, removeToken } from "./auth";

const API = axios.create({
  baseURL: BASE_URL,
});

export {API}