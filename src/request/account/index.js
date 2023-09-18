import request from "@/request/request";
const API = require("@/apis");

export const accountGetCloudMusicLoginState = config => request._get(API.ACCOUNT_GET_CLOUD_MUSIC_LOGIN_STATE,config);
export const accountGetCloudMusicQRLoginKey = config => request._get(API.ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_KEY,config);
export const accountGetCloudMusicQRLoginImgURL = config => request._get(API.ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_IMG_URL,config);
export const accountGetCloudMusicQRLoginImgState = config => request._get(API.ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_IMG_STATE,config);
export const accountCloudMusicLogout = config => request._get(API.ACCOUNT_CLOUD_MUSIC_LOGOUT,config);
export const accountCloudMusicPasswordLogin = config => request._get(API.ACCOUNT_CLOUD_MUSIC_PASSWORD_LOGIN,config);
export const accountGetCloudMusicLoginCaptcha = config => request._get(API.ACCOUNT_CLOUD_MUSIC_LOGIN_SEND_CAPTCHA,config);