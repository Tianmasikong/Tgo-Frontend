<template>
  <div class="input" style="background-color: white;height: 100%">
    <el-col :span="8" :offset="15">
      <el-card shadow="always" class="card">
      <div class="inputInnerHead">
        <p style="font-size: larger">Tgo Demo</p>
        <p style="margin-top: 10px">我们现在未开放注册，试用请联系作者</p>
        <el-button text @click="open" class="clickWhyButton">为什么采取这种方式？</el-button>
      </div>
      <div class="inputInner">
        <el-form :model="form" label-position="top">
          <el-form-item label="Username">
            <el-input
                v-model="form.name"
            />
          </el-form-item>
          <el-form-item label="Password">
            <el-input
                type="password"
                show-password
                v-model="form.password"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Login</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    </el-col>
  </div>
</template>


<script>
import {defineComponent} from 'vue'
import {encrypt} from "@/util/secret";
import {userlogin} from "@/request/user";
import {ElMessageBox } from 'element-plus'
export default defineComponent({
  name: "LoginView",
  data(){
    return{
      form:{
        name: '',
        password: null
      }
    }
  },
  methods: {
    onSubmit() {
      let params = {
        userName: this.form.name,
        password: encrypt(this.form.password)
      }
      userlogin(params).then(res => {
        if (res.data.code !== '00000') {
          this.$message({
            type: 'error',
            message: res.data.msg
          });
        } else {

          sessionStorage.setItem("userToken",res.headers.token)
          sessionStorage.setItem("userInfo", JSON.stringify(res.data.result))
          this.$message({
            type: 'success',
            message: '登陆成功！'
          });
          this.$router.push('/')
        }
      })
      },
    open() {
      ElMessageBox.alert(
          '网站目前处于测试阶段，仍有大量缺陷未处理，因此我们选择关闭注册功能。' +
          '如果您有好的建议或者Bug反馈，又或许是想要参与测试，请发送邮件给210583478@qq.com',
          '📣📣📣',
          {
        showClose: false,
        confirmButtonText: '我知道了'
          })
    }
  }
})
</script>

<style scoped>
  .input {
    height: 100%;
    overflow: hidden;
  }
  .clickWhyButton {
    margin-top: 10px;
    font-size: small;
    color: blue;
    font-style: italic;
  }
  .card {
    height: 500px;
    background-color: rgba(255,255,255,0.5);
    margin-top: 10%;
  }
  .inputInnerHead {
    width: 100%;
    margin-top: 10%;
    margin-bottom: 10%;
  }
  .inputInnerHead p{
    margin: 0 auto;
    text-align: center;
  }

  .inputInner {
    width: 80%;
    margin: 0 auto;
    text-align: center;
  }
</style>