import Axios from "axios";
import Router from "../router";

const instanceNormal = () => {
    let token = sessionStorage.getItem("userToken");
    let headers = token ? {
        "token": token
    } : {};
    return Axios.create({
        // baseURL:
        //   process.env.NODE_ENV === "production"
        //     ? REQUEST_BASE_URL_PROD
        //     : REQUEST_BASE_URL_DEV,
        headers
    });
}
// 添加请求拦截器

const _get = (url, config) => {
    console
    return new Promise((resolve, reject) => {
        instanceNormal()
        .get(url, config)
        .then(res => {
            if(!url.startsWith("/api/user") && !url.startsWith("/cloudMusic")){
                const token = res.headers.token;
                if (token) {
                    sessionStorage.setItem('userToken', token);
                } else {
                    sessionStorage.removeItem('userToken');
                    Router.push('/login');
                }
            }
            resolve(res);
        })
        .catch(err => {
            reject(err);
        });
    });
};
const _post = (url, config) => {
    return new Promise((resolve, reject) => {
        instanceNormal()
        .post(url, config)
        .then(res => {
            // console.log(url)
            if(!url.startsWith("/api/user") && !url.startsWith("/cloudMusic")){
                const token = res.headers.token;
                if (token) {
                    sessionStorage.setItem('userToken',token);
                } else {
                    sessionStorage.removeItem('userToken');
                    Router.push('/login');
                }
            }
            resolve(res);
        })
        .catch(err => {
            reject(err);
        });
    });
};
const _delete = (url, config) => {
    return new Promise((resolve, reject) => {
        instanceNormal()
        .delete(url, config)
        .then(res => {
            if(!url.startsWith("/api/user")){
                const token = res.headers.token;
                if (token) {
                    sessionStorage.setItem('userToken',token);
                } else {
                    sessionStorage.removeItem('userToken');
                    Router.push('/login');
                }
            }
            resolve(res);
        })
        .catch(err => {
            reject(err);
        });
    });
};
const _put = (url, config) => {
    return new Promise((resolve, reject) => {
        instanceNormal()
        .put(url, config)
        .then(res => {
            if(!url.startsWith("/api/user")){
                const token = res.headers.token;
                if (token) {
                    sessionStorage.setItem('userToken',token);
                } else {
                    sessionStorage.removeItem('userToken');
                    Router.push('/login');
                }
            }
            resolve(res);
        })
        .catch(err => {
            reject(err);
        });
    });
};

export default {
    _get,
    _post,
    _delete,
    _put
};