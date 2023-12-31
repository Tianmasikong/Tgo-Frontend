import {createRouter, createWebHashHistory} from "vue-router";
//const Main = () => import("../views/Main.vue")
const Login = () => import("../views/user/Login.vue")
const CloudMusicManage = () => import("../views/account/CloudMusicManage.vue")
const Listen = () => import("../views/listen/Listen.vue")

const routes = [
    {
        path: "/",
        component: CloudMusicManage
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/cloudmusicmanage",
        component: CloudMusicManage
    },
    {
        path: "/listentgo",
        component: Listen
    }
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

// //设置全局的前置导航守卫,me
// router.beforeEach((to,from,next)=>{
//     if(to.path === '/login' || to.path === '/register' || to.path === '/forgetpwd'){  //如果目的路径是***，不做操作
//         next();
//     } else {
//         //其他路径，先判断本地是否存在Token，存在则正常跳转，否则重定向到login界面
//         let token = sessionStorage.getItem('userToken');
//         if(!token){
//             next('/login');
//         }
//         else{
//             next();
//         }
//     }
// })
export default router;
