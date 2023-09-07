<template>
  <div class="index">
    <HelloWorld/>
  </div>
</template>
<script>
import {defineComponent} from 'vue'
import HelloWorld from "@/components/HelloWorld.vue";

export default defineComponent({
  name: "HelloView",
  components: {
    HelloWorld
  }
})
</script>

<style scoped>

</style>