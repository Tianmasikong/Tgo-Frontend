// 引用AES源码js
const CryptoJS = require('crypto-js');

// 128位的密钥与IV，与后端约定好
let crypt_key = 'Ty7kWn9kGUiZx72U';
let crypt_iv = 'BuqJQGRaHZyi9okK';

// 加密
export function encrypt(data) {
    // 将key解析为字节
    let aes_key = CryptoJS.enc.Utf8.parse(crypt_key);
    // 将iv解析为字节
    let new_iv = CryptoJS.enc.Utf8.parse(crypt_iv);
    // AES加密 CBC模式 ZeroPadding
    let encrypted = CryptoJS.AES.encrypt(data, aes_key, {
        iv: new_iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    // 返回字符串
    return encrypted.toString();
}

//解密
export function decrypt(data) {
    let aes_key = CryptoJS.enc.Utf8.parse(crypt_key);
    let aes_iv = CryptoJS.enc.Utf8.parse(crypt_iv);
    // 将数据编码成Base64格式
    let baseResult=CryptoJS.enc.Base64.parse(data);
    let ciphertext=CryptoJS.enc.Base64.stringify(baseResult);
    // AES解密 CBC模式 ZeroPadding
    let decryptResult = CryptoJS.AES.decrypt(ciphertext, aes_key, {
        iv: aes_iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    // 返回字符串
    let resData = decryptResult.toString(CryptoJS.enc.Utf8).toString();
    return resData;
}

