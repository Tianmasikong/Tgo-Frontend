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
        <div style="margin-top:10%">
          <el-text>当前登陆状态:</el-text>
          <el-text :type="loginStateType">{{loginState}}</el-text>
          <el-button v-show="islogin">登出</el-button>
          <el-button v-show="!islogin" @click="login">去登陆</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import {defineComponent, h} from "vue";
import {
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
    async login() {
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
                    type: 'warning',
                    message: '授权登录成功',
                  })
                  localStorage.setItem('cookie', statusRes.cookie)
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
    }
  },
  data() {
    return {
      loginState : '',
      loginStateType : '',
      islogin:false
    }
  },
  mounted() {
    let config = {
      param : {
        _t: Date.parse(new Date()) / 1000 // 时间戳
      }
    }
    accountGetCloudMusicLoginState(config).then(res => {
      let profile = res.data.data.profile;
      if( profile === null || profile === undefined) {
          this.loginState = "未登录";
          this.loginStateType = "danger";
          this.islogin = false;
      } else {
          this.loginState = "已登录";
          this.loginStateType = "success";
          this.islogin = true;
      }
    })
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