<template>
  <div class="index">
    <el-container class="index">
      <el-aside width="20%">

      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>
<script>
import {defineComponent} from 'vue'
//import SideBar from "@/components/SideBar.vue";

export default defineComponent({
  name: "MainView",
  components: {}

})
</script>

<style scoped>
.index {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>