<script>
import {defineComponent} from "vue";
import {
  musicListCardFindMusicIfAccessible, musicListCardGetLyricById,
  musicListCardGetMusicList,
  musicListCardGetMusicsByListId, musicListCardGetMusicUrl
} from "@/request/component";
import {VideoPlay} from "@element-plus/icons-vue";
import {warningAudio} from "@/constant/video";


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
      filterMusics: [],
      drawer: false,
      musicListName: '',
      nowIndex: 0,
      keyword: "",
    }
  },
  methods: {
    handleSearch() {
      // 处理搜索框输入变化的逻辑
      // 使用关键字过滤歌曲
      const keyword = this.keyword.toLowerCase();
      this.filterMusics = this.musics.filter(
          (music) =>
              music.name.toLowerCase().includes(keyword) ||
              music.ar.toLowerCase().includes(keyword) ||
              music.al.toLowerCase().includes(keyword)
      );
    },
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
        this.filterMusics = this.musics
        if (this.musics == null) {
          this.$message({
            type: 'error',
            message: '此歌单为空',
            duration: 800
          });
          return;
        }
        for (let i = 0; i < this.musics.length; i++) {
          if (typeof this.musics[i] !== 'string') {
            break;
          }
          this.musics[i] = JSON.parse(this.musics[i]);
        }
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
            let ifVIP = tmp[0].fee;
            if (ifVIP === 1 || ifVIP === 4) {
              this.$message({
                type: 'warning',
                message: '正在试听，开通黑胶会员听整首！',
                duration: 1500
              });
            }
          });
          musicListCardGetLyricById(config).then(async res => {
            let tmp = res.data.lrc;
            await this.$emit('change', "lyric", tmp.lyric);
          })
        } else {
          warningAudio.play();
          this.$message({
            type: 'error',
            message: res.data.message
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
          <div style="height:40px;font-size: small;font-weight: bolder;">
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
          size="30%"
      >
        <template #header>
          <div class="custom-header">
            {{musicListName}}
          </div>
        </template>
        <!-- 搜索框 -->
        <el-input v-model="keyword" placeholder="输入歌手/歌曲/专辑进行搜索" @input="handleSearch"/>

        <el-table
            :data="filterMusics"
            height="95%"
            highlight-current-row
            @row-dblclick=setMusic
            style="width: 100%;user-select: none;">
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
.custom-header {
  margin-bottom: 0px; /* 设置合适的数值 */
  padding-bottom: 0px;
  color: #AFD5DE;
}
.card {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.19);
  border-width: 0;
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
