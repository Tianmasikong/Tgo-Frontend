<template>
  <el-row class="sideBar">
    <el-col :span="12" style="flex: 0 0 100%;width:100%;max-width:100%">
      <h5 class="mb-2">
        <el-link href="/">Tgo Demo</el-link>
      </h5>
      <el-menu
          default-active="1"
          class="sideBarInner"
          @open="handleOpen"
          @close="handleClose"
          router
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><userFilled /></el-icon>
            <span>我的账号</span>
          </template>
          <el-menu-item index="1-1" route="/cloudmusicmanage">
            <el-icon><MostlyCloudy /></el-icon>
            网易云账号
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="2" route="/listentgo">
          <el-icon><headset/></el-icon>
          <span>一起听</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <el-icon><document /></el-icon>
          <span>测试</span>
        </el-menu-item>
        <el-menu-item index="4" disabled>
          <el-icon><setting /></el-icon>
          <span>测试</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
import {defineComponent} from 'vue'
import {Document, Setting,MostlyCloudy, UserFilled, Headset} from "@element-plus/icons-vue";

export default defineComponent({
  name: "SideBar",
  components: {Headset, UserFilled, MostlyCloudy,Setting, Document},

})
</script>

<style scoped>
.sideBar {
  height: 100%;
  width: 100%
}
.sideBarInner {
  height: 100%;
  width: 100%
}
</style>