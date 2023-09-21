<template>
  <div class="index">
    <el-container class="index">
      <el-aside width="20%">
        <SideBar></SideBar>
      </el-aside>
      <el-main>
        <div>
          <el-text size="large">BorrowListen</el-text>
        </div>
        <div>
          <el-button text @click="open" class="clickWhyButton">什么是借听？</el-button>
        </div>
        <el-col :span="8" :offset="8">
          <el-card style="height: 10%">
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
import {defineComponent} from 'vue'
import SideBar from "@/components/SideBar.vue";
import {ElMessageBox} from "element-plus";

export default defineComponent({
  name: "BorrowListenView",
  components: {SideBar},
  methods:{
    open() {
      ElMessageBox.alert(
          '借听功能就是在登陆一个VIP账号的情况下，可以浏览自己的非VIP账号的歌单等'+
          '，借用另一个账号的VIP权限来听自己的歌单。',
          '📣📣📣',
          {
            showClose: false,
            confirmButtonText: '我知道了'
          })
    }
  },
  data(){
    return{
      user:{
        profile:{
          nickname:'未登录',
          avatarUrl:''
        }
      }
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
.clickWhyButton {
  margin-top: 10px;
  font-size: small;
  color: blue;
  font-style: italic;
}
</style>