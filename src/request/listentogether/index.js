import request from "@/request/request";
const API = require("@/apis");

export const tgoCreateRoom = config => request._post(API.TGO_CREAT_ROOM,config);
export const tgoGetRoom = config => request._post(API.TGO_GET_ROOM,config);
export const tgoDelRoom = config => request._post(API.TGO_DEL_ROOM,config);
export const tgoUpdateRoom = config => request._post(API.TGO_UPDATE_ROOM,config);
