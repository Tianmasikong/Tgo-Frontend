import request from "@/request/request";
const API = require("@/apis");

export const getHelloMsg = config => request._get(API.HOME,config);