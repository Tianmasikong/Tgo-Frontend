<template>
  <el-row class="sideBar">
    <el-col :span="12" style="flex: 0 0 100%;width:100%;max-width:100%">
      <h5 class="mb-2">
        <img src="../../public/img_1.png" style="width: 140px">
      </h5>
      <el-menu

          active-text-color="#6699CC"
          ref="musicManageMenu"
          class="sideBarInner"
          :default-active="activeIndex"
          @open="handleOpen"
          @close="handleClose"
          router
      >
        <el-menu-item index="1" route="/cloudmusicmanage">
          <el-icon><MostlyCloudy/></el-icon>
          <span>网易云账号</span>
        </el-menu-item>
        <el-menu-item index="2" route="/listentgo">
          <el-icon><headset/></el-icon>
          <span>听歌</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
import {defineComponent} from 'vue'
import { Headset,MostlyCloudy} from "@element-plus/icons-vue";

export default defineComponent({
  name: "SideBar",
  components: {Headset, MostlyCloudy },
  data() {
    return {
      activeIndex: '',
    };
  },


  // 在这里指定组件对应的标签的 index 值
  // 当路由匹配到该组件时，对应的标签就会高亮显示
  // 在这个例子中，当路由为 `/listentgo` 时，第二个标签会被高亮显示
  mounted() {
      if (this.$route.path === '/cloudmusicmanage') {
        this.activeIndex = '1'
      }
      if (this.$route.path === '/listentgo') {
        this.activeIndex = '2'
      }
  },
})
</script>

<style scoped>
.sideBar {
  height: 100%;
  width: 100%;
  padding-bottom: 40%;
  background-color: #f9fdfd;
}
.sideBarInner {
  height: 100%;
  width: 100%;
  background-color: #f9fdfd;
}
</style>
