//测试路由
const HOME = "/api/hello/getmsg";

//用户管理
const USER_LOGIN = "/api/user/login"

//音乐账号管理
const ACCOUNT_GET_CLOUD_MUSIC_LOGIN_STATE = "/cloudMusic/login/status"
const ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_KEY = "/cloudMusic/login/qr/key"
const ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_IMG_URL = "/cloudMusic/login/qr/create"
const ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_IMG_STATE = "/cloudMusic/login/qr/check"
module.exports = {
    HOME,
    USER_LOGIN,
    ACCOUNT_GET_CLOUD_MUSIC_LOGIN_STATE,
    ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_KEY,
    ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_IMG_URL,
    ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_IMG_STATE
}