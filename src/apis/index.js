//测试路由
const HOME = "/api/hello/getmsg";

//用户管理
const USER_LOGIN = "/api/user/login"

//音乐账号管理
const ACCOUNT_GET_CLOUD_MUSIC_LOGIN_STATE = "/cloudMusic/login/status"
const ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_KEY = "/cloudMusic/login/qr/key"
const ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_IMG_URL = "/cloudMusic/login/qr/create"
const ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_IMG_STATE = "/cloudMusic/login/qr/check"
const ACCOUNT_CLOUD_MUSIC_LOGOUT = '/cloudMusic/logout'
const ACCOUNT_CLOUD_MUSIC_PASSWORD_LOGIN = '/cloudMusic/login/cellphone'
const ACCOUNT_CLOUD_MUSIC_LOGIN_SEND_CAPTCHA = '/cloudMusic/captcha/sent'

//一起听
const TGO_CREAT_ROOM = '/api/tgo/createroom'
const TGO_GET_ROOM = '/api/tgo/getroom'
const TGO_DEL_ROOM = '/api/tgo/delroom'
const TGO_UPDATE_ROOM = '/api/tgo/updateroom'

//公共组件
const MUSIC_LIST_CARD_GET_MUSIC_LIST = '/cloudMusic/user/playlist'
const MUSIC_LIST_CARD_GET_MUSICS_BY_LIST_ID = '/api/myCloudMusic/getMusicsByListsId'
const MUSIC_LIST_CARD_FIND_MUSIC_IF_ACCESSIBLE = '/cloudMusic/check/music'
const MUSIC_LIST_CARD_GET_MUSIC_URL = '/cloudMusic/song/url/v1'
module.exports = {
    HOME,
    USER_LOGIN,
    ACCOUNT_GET_CLOUD_MUSIC_LOGIN_STATE,
    ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_KEY,
    ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_IMG_URL,
    ACCOUNT_GET_CLOUD_MUSIC_QR_LOGIN_IMG_STATE,
    ACCOUNT_CLOUD_MUSIC_LOGOUT,
    ACCOUNT_CLOUD_MUSIC_PASSWORD_LOGIN,
    ACCOUNT_CLOUD_MUSIC_LOGIN_SEND_CAPTCHA,
    TGO_CREAT_ROOM,
    TGO_GET_ROOM,
    TGO_DEL_ROOM,
    TGO_UPDATE_ROOM,
    MUSIC_LIST_CARD_GET_MUSIC_LIST,
    MUSIC_LIST_CARD_GET_MUSICS_BY_LIST_ID,
    MUSIC_LIST_CARD_FIND_MUSIC_IF_ACCESSIBLE,
    MUSIC_LIST_CARD_GET_MUSIC_URL
}