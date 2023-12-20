<template>
  <div class="index">
    <el-container class="index">
      <el-aside width="20%">
        <SideBar></SideBar>
      </el-aside>
      <el-main>
        <div>
          <el-text size="large">CloudMusicManage</el-text>
        </div>
        <div style="margin-top:5%">
          <el-text>当前登陆状态:</el-text>
          <el-text :type="loginStateType">{{loginState}}</el-text>
          <el-button v-show="islogin" @click="logout">登出</el-button>
          <el-tooltip content="如果二维码登陆失效，请使用其他登陆方式" placement="bottom" effect="light">
            <el-button v-show="!islogin" @click="loginWithQR">二维码登陆</el-button>
          </el-tooltip>
          <el-button v-show="!islogin" @click="loginWithPasswordShow = true">验证码登陆</el-button>
        </div>
        <el-dialog v-model="loginWithPasswordShow" title="手机验证码登陆">
          <el-form :model="form">
            <el-form-item label="手机号" label-width='140px'>
              <el-input v-model="form.phoneNum" autocomplete="off" />
            </el-form-item>
            <el-form-item label="验证码" label-width='140px'>
              <el-input v-model="form.captcha"
                        autocomplete="off">
                <template #append>
                  <el-button type="primary" size="small" v-show="!codeShow" @click="sendCaptcha">获取验证码</el-button>
                  <el-button type="primary" size="small" disabled v-show="codeShow">{{count}}秒后重试</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="loginWithPasswordShow = false">Cancel</el-button>
              <el-button type="primary" @click="loginWithPassword">
                Confirm
              </el-button>
            </span>
          </template>
        </el-dialog>
        <el-col :span="8" :offset="3" v-show="user.profile.avatarUrl!==''" style="position: center;">
          <el-card :body-style="{ padding: '0px' }" fit style="width: 1024px; position: center;">
          <img
              :src="user.profile.avatarUrl"
              class="image"
              alt="404"
          />
          <div style="padding: 14px">
            <span>{{ user.profile.nickname }}</span>
            <div class="bottom">
              <el-button text class="button">您</el-button>
            </div>
          </div>
        </el-card>
        </el-col>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import {defineComponent, h} from "vue";
import {
  accountCloudMusicLogout, accountCloudMusicPasswordLogin, accountGetCloudMusicLoginCaptcha,
  accountGetCloudMusicLoginState, accountGetCloudMusicQRLoginImgState,
  accountGetCloudMusicQRLoginImgURL,
  accountGetCloudMusicQRLoginKey
} from "@/request/account";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "@/router";

export default defineComponent({
  name: "CloudMusicManageView",
  components: {SideBar},
  methods:{
    async loginWithQR() {
      let config = {
        params: {
          _t: Date.parse(new Date()) / 1000 // 时间戳
        }
      };
      let key = '';
      let QRImgURL = '';
      await accountGetCloudMusicQRLoginKey(config).then(res => {
        key = res.data.data.unikey;
      });
      config.params = {
        key: key,
        _t: Date.parse(new Date()) / 1000, // 时间戳
        qrimg: true
      };
      await accountGetCloudMusicQRLoginImgURL(config).then(res => {
        QRImgURL = res.data.data.qrimg
      });
      await ElMessageBox(
          {
            title: '请使用手机扫码完成登陆，操作完成后点击OK更新页面状态',
            message: h('img', {src: QRImgURL}),
            center: true,
            showClose: false,
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                config.params = {
                  key: key,
                  _t: Date.parse(new Date()) / 1000 // 时间戳
                };
                const statusRes = await accountGetCloudMusicQRLoginImgState(config).then(res => {
                  return res.data;
                })
                if (statusRes.code === 800) {
                  ElMessage({
                    type: 'warning',
                    message: '二维码已过期,请重新获取',
                  })
                }
                else if (statusRes.code === 803) {
                  // 这一步会返回cookie
                  ElMessage({
                    type: 'success',
                    message: '授权登录成功',
                  })
                  console.log(statusRes);
                  localStorage.setItem('cookie', statusRes.cookie)
                  localStorage.setItem('profile', JSON.stringify(statusRes.profile))
                  router.go(0)
                }
                else {
                  ElMessage({
                    type: 'warning',
                    message: '登陆失败，请重新扫码',
                  })
                }
                done()
              } else {
                done()
              }
            },
          }
      )
    },
    async loginWithPassword() {
      this.loginWithPasswordShow = false;
      let config = {
        params: {
          _t: Date.parse(new Date()) / 1000, // 时间戳
          captcha: this.form.captcha,
          phone: this.form.phoneNum
        }
      }
      accountCloudMusicPasswordLogin(config).then(res =>{
        console.log(res);
        if (res.data.cookie === null) {
            // 这一步会返回cookie
            ElMessage({
              type: 'warning',
              message: '登陆失败',
            })

          }
          else {
            ElMessage({
              type: 'success',
              message: '登陆成功',
            })
            localStorage.setItem('cookie', res.data.cookie);
            localStorage.setItem('profile',JSON.stringify(res.data.profile));
            router.go(0)
          }
      })
    },
    logout() {
      let config = {
        params: {
          _t: Date.parse(new Date()) / 1000 // 时间戳
        }
      };
      accountCloudMusicLogout(config).then(res =>{
        console.log(res.data.code);
        if(res.data.code === 200) {
          ElMessage({
            type: 'success',
            message: '退出登录成功',
          })
          this.user.profile.avatarUrl=null;
          localStorage.removeItem("profile");
          localStorage.removeItem("cookie")
          router.go(0);
        } else {
          ElMessage({
            type: 'warning',
            message: '未知错误',
          })
        }
      })
    },
    timeDown(time){
      if(!this.timer) {
        this.count = Math.ceil((JSON.parse(time) - new Date().getTime())/1000);
        this.codeShow = true;
        this.timer = setInterval(() => {
          if (this.count > 0) {
            this.count--;
          } else {
            this.codeShow = false;
            clearInterval(this.timer);
            this.timer = null;
            sessionStorage.removeItem('EndTime');
          }
        },1000)
      }
    },
    async sendCaptcha(){
      let config = {
        params : {
          _t: Date.parse(new Date()) / 1000, // 时间戳
          phone: this.form.phoneNum
        }
      }
      this.codeShow = true;
      let clicktime = new Date().getTime() + 60000;
      sessionStorage.setItem('EndTime',JSON.stringify(clicktime));
      await accountGetCloudMusicLoginCaptcha(config).then(res => {
        console.log(res);
      });
      let endTime = sessionStorage.getItem('EndTime');
      if(endTime){
        this.timeDown(endTime);
      }
    },
  },
  data() {
    return {
      loginState : '',
      loginStateType : '',
      islogin:false,
      loginWithPasswordShow:false,
      form:{
        phoneNum:'',
        captcha:''
      },
      count:'',
      codeShow:false,
      timer:null,
      user:{
        profile:{
          avatarUrl:'',
          nickname:''
        }
      }
    }
  },
  mounted() {
    let config = {
      params : {
        timestamp: Date.parse(new Date()) / 1000 // 时间戳
      }
    }
    accountGetCloudMusicLoginState(config).then(res => {
      let profile = res.data.data.profile;
      console.log(profile)
      if( profile === null || profile === undefined) {
          this.loginState = "未登录";
          this.loginStateType = "danger";
          this.islogin = false;
      } else {
          this.loginState = "已登录";
          this.loginStateType = "success";
          this.islogin = true;
          localStorage.setItem('profile',JSON.stringify(profile));
          this.user.profile = profile;
      }

    })
  },
  created() {
    let endTime = sessionStorage.getItem('EndTime');
    if(endTime){
      this.timeDown(endTime);
    }
  }
})
</script>

<style scoped>
.index {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>