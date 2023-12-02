<script>
import {defineComponent} from "vue";
import SideBar from "@/components/SideBar.vue";
import MusicPlayer from "@/components/listen/MusicPlayer.vue";
import MusicListCard from "@/components/listen/MusicListCard.vue";

export default defineComponent({
  name: "ListenTogetherView",
  components: {MusicListCard, MusicPlayer, SideBar},
  data() {
    return {
      musicUrl: '',
      musicId: '',
      musicPic: 'https://s2.loli.net/2023/11/28/W6bLBdvZn1gjPaY.png',
      musicName: '',
      musicState: ''
    }
  },
  methods: {
    async costPlannedAmountChange(key, value) {
      if (key === 'musicUrl') {
        this.musicUrl = value;
      }
      if (key === 'musicId') {
        this.musicId = value;
      }
      if (key === 'musicState') {
        if (value === 'playing') {
          setTimeout(this.$refs.music.play, 1000);
        }
        this.musicState = value;
      }
      if (key === 'musicName') {
        this.musicName = value;
      }
      if (key === 'musicPic') {
        this.musicPic = value;
        console.log("pic:!!! " + value)
      }
    },
    async getNextMusicByOrder(value) {
      await this.$refs.card.getNextMusicByOrder(value);
    },
    async getNextMusic() {
      await this.$refs.card.getNextMusicByOrder(0);
    },
    async getPrevMusic() {
      await this.$refs.card.getPrevMusic();
    }
  }
})
</script>

<template>
  <div class="index">
    <el-container class="index">
      <el-aside width="20%">
        <SideBar></SideBar>
      </el-aside>
      <el-main class="main">
        <div>
          <img src="../../../public/Listen-logos_black.png" alt="" style="width: 200px">
        </div>
        <br>
        <div style="height: 50%">
          <div>
            <img v-if="musicPic" :src="musicPic" style="width: 20%;height: 40%"/>
          </div>
          <el-text>{{ musicName }}</el-text>
          <MusicPlayer :song="musicUrl"
                       @change="costPlannedAmountChange"
                       @nextMusic="getNextMusicByOrder"
                       @next="getNextMusicByOrder"
                       @prev="getPrevMusic"
                       ref="music"
          style="margin-top: 8%"/>
        </div>
        <div  style="padding-top: 7%">
          <MusicListCard @change="costPlannedAmountChange" ref="card"/>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.index {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.main {
  width: 100%;
  /*background-color: #f5f7f7;*/
}
</style>
