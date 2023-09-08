import request from "@/request/request";
const API = require("@/apis");

export const userlogin = config => request._post(API.USER_LOGIN,config);