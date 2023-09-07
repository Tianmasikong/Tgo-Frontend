<template>
  <div class="hello">
    <h1>123</h1>
    <h1>{{ msg }}</h1>
    <el-button>test</el-button>
  </div>
</template>

<script>
import {getHelloMsg} from "@/request/hello";

export default {
  name: 'HelloWorld',
  data() {
    return {
      msg : ''
    }
  },
  mounted() {
    let config;
    getHelloMsg(config).then(_res => {
      console.log(_res.data);
      this.msg = _res.data.message;
    })
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
</style>
