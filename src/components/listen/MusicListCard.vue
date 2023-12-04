<script>
import {defineComponent} from "vue";
import {
  musicListCardFindMusicIfAccessible, musicListCardGetLyricById,
  musicListCardGetMusicList,
  musicListCardGetMusicsByListId, musicListCardGetMusicUrl
} from "@/request/component";
import {VideoPlay} from "@element-plus/icons-vue";


export default defineComponent({
  name: "MusicListCard",
  components: {VideoPlay},
  created() {
    this.getMusicLists();
  },
  data() {
    return {
      number: 5,
      currentPage: 1,
      size: 50,
      musicList: [],
      musics: [],
      drawer: false,
      musicListName: '',
      nowIndex: 0
    }
  },
  methods: {
    getMusicLists() {
      let profile = JSON.parse(localStorage.getItem("profile"));
      if (profile === null || profile === undefined) {
        return;
      }
      let config = {
        params: {
          timestamp: Date.parse(new Date()) / 1000,
          uid: profile.userId
        }
      }
      musicListCardGetMusicList(config).then(res => {
        this.musicList = res.data.playlist;
        this.size = res.data.playlist.length;
      })
    },
    getMusicName(off) {
      let tmp = JSON.stringify(this.musicList[(this.currentPage - 1) * this.number + off])
      if (tmp === undefined) return "";
      let sec = JSON.parse(tmp);
      return sec.name;
    },
    getMusicPic(off) {
      let tmp = JSON.stringify(this.musicList[(this.currentPage - 1) * this.number + off])
      if (tmp === undefined) return "";
      let sec = JSON.parse(tmp);
      return sec.coverImgUrl;
    },
    getMusicsByListId(off) {
      let tmp = JSON.stringify(this.musicList[(this.currentPage - 1) * this.number + off])
      if (tmp === undefined) return "";
      let sec = JSON.parse(tmp).id;
      let config = {
        params: {
          id: sec,
          timeStamp: Date.parse(new Date()) / 1000
        }
      };
      musicListCardGetMusicsByListId(config).then(res => {
        this.musics = res.data.result;
        this.musicListName = this.getMusicName(off);
        this.drawer = true;
      });
    },
    setMusic(val) {
      let config = {
        params: {
          id: val.id,
          timeStamp: Date.parse(new Date()) / 1000
        }
      };
      musicListCardFindMusicIfAccessible(config).then(res => {
        if (res.data.success) {
          config.params = {
            id: val.id,
            timeStamp: Date.parse(new Date()) / 1000,
            level: 'standard'
          };
          musicListCardGetMusicUrl(config).then(async res => {
            let tmp = res.data.data;
            let url = tmp[0].url;
            await this.$emit('change', "musicUrl", url);
            await this.$emit('change', "musicId", val.id);
            await this.$emit('change', "musicState", 'playing');
            await this.$emit('change', "musicName", val.name);
            await this.$emit('change', "musicPic", val.pic);
            this.nowIndex = val.index;
          });
          musicListCardGetLyricById(config).then(async res => {
            let tmp = res.data.lrc;
            await this.$emit('change', "lyric", tmp.lyric);
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message
          });
        }
      })
    },
    async getNextMusicByOrder(flag) {
      if (flag === 0) {//顺序播放
        this.nowIndex = this.nowIndex + 1;
        if (this.nowIndex >= this.musics.length) {
          this.nowIndex = 0;
        }
        let val = this.musics[this.nowIndex];
        await this.setMusic(val);
      } else if (flag === 1) {//单曲循环
        //do nothing
      } else if (flag === 2) {//列表随机
        let random1 = Math.floor(Math.random() * (this.musics.length));
        while (random1 === this.nowIndex) {
          random1 = Math.floor(Math.random() * (this.musics.length));
        }
        this.nowIndex = random1;
        let val = this.musics[this.nowIndex];
        await this.setMusic(val);
      }
    },
    async getPrevMusic() {
      this.nowIndex = this.nowIndex - 1;
      if (this.nowIndex < 0) {
        this.nowIndex = this.musics.length - 1;
      }
      let val = this.musics[this.nowIndex];
      await this.setMusic(val);
    }
  }
})
</script>

<template>
  <div class="cardIndex">
    <el-row>
      <el-col
          v-for="(o, index) in number"
          :key="o"
          :span="4"
          :offset="index > 0 ? 1 : 0"
      >
        <el-card :body-style="{ padding: '0px' }" shadow="always" @click="getMusicsByListId(index)" class="card"
                 v-if="getMusicPic(index)">
          <div class="img_cover">
            <img
                :src="getMusicPic(index)"
                class="image"/>
            <div class="cover">
              <el-icon class="cover_img" size="100px">
                <videoPlay/>
              </el-icon>
            </div>
          </div>
          <div style="height:40px;font-size: small;font-weight: bolder">
            <span id="musicListName">{{ getMusicName(index) }}</span>
          </div>
        </el-card>
      </el-col>
      <el-pagination
          class="musicCardSelector"
          layout="prev, pager, next"
          :page-size="number"
          v-model:current-page="currentPage"
          :total="size"/>
    </el-row>
    <el-popover v-model="drawer">
      <el-table
          :data="musics"
          height="100%"
          highlight-current-row
          @row-dblclick=setMusic
          style="width: 100%">
        <el-table-column prop="name" label="歌曲名" width="180"/>
        <el-table-column prop="ar" label="歌手名" width="100"/>
        <el-table-column prop="al" label="专辑"/>
      </el-table>
    </el-popover>
    <div class="draw-parent">
      <el-drawer
          :title="musicListName"
          :append-to-body="false"
          style="position:absolute;"
          v-model="drawer"
          :direction="'ltr'"
          size="20%"
      >
        <el-table
            :data="musics"
            height="100%"
            highlight-current-row
            @row-dblclick=setMusic
            style="width: 100%">
          <el-table-column prop="name" label="歌曲名" width="180"/>
          <el-table-column prop="ar" label="歌手名" width="100"/>
          <el-table-column prop="al" label="专辑"/>
        </el-table>
      </el-drawer>
    </div>
  </div>
</template>

<style scoped>
.draw-parent {
  position: relative;
  overflow: hidden;
  width: 20%;
  height: 50%;
  margin: auto;
}

.card {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19);
}

.card:hover {
  transition: all 1s;
  transform: scale(1.1);
}

.cardIndex {
  width: 50%;
  margin: 0 auto;
  text-align: center;
}

.image {
  width: 100%;
  text-align: center;
  margin: 0 auto;
}

.musicCardSelector {
  margin: 5% auto 0;
  text-align: center;
}

/*.img_cover:hover {*/
/*  transition: all 1s;*/
/*  transform: scale(1.05);*/
/*}*/

.cover {
  margin: 0 auto;
  top: 0px;
  width: 100%;
  height: 96%;
  text-align: center;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 1;
}

/* 鼠标hover,显示遮罩,设置过渡时间 */
.cover:hover {
  cursor: pointer;
  transition: all 1s;
  opacity: 0.9;
  color: #99CCFF;
}

.img_cover {
  position: relative;
  margin: 0 auto;
}

.cover_img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}
</style>
