<template>
  <div class="input" style="background-color: red;height: 100%">
    <el-col :span="8" :offset="15">
      <el-card shadow="always" class="card">
        <div class="inputInnerHead">
          <p style="font-size: larger">Tgo Demo</p>
          <p style="margin-top: 10px">我们现在未开放注册，试用请联系作者</p>
        </div>
        <div class="inputInner">
          <el-form :model="form" label-position="top">
            <el-form-item label="Username">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="Password">
              <el-input v-model="form.password" />
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

export default defineComponent({
  name: "LoginView",
  data(){
    return{
      form:{
        name: '',
        password: null
      }
    }
  }
})
</script>

<style scoped>
  .card {
    margin-top: 10%;
    height: 500px;
    background-color: rgba(255,255,255,0.2);
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