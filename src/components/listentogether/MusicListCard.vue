<script>
import {defineComponent} from "vue";
import {
  musicListCardFindMusicIfAccessible,
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
  data(){
    return {
      number: 5,
      currentPage:1,
      size: 50,
      musicList:[],
      musics:[],
      drawer: false,
      musicListName:''
    }
  },
  methods:{
    getMusicLists(){
      let profile = JSON.parse(localStorage.getItem("profile"));
      let config = {
        params:{
          timestamp: Date.parse(new Date()) / 1000,
          uid: profile.userId
        }
      }
      musicListCardGetMusicList(config).then(res=>{
        this.musicList = res.data.playlist;
        this.size = res.data.playlist.length;
      })
    },
    getMusicName(off){
      let tmp = JSON.stringify(this.musicList[(this.currentPage - 1)*this.number + off])
      if(tmp === undefined)return "";
      let sec = JSON.parse(tmp);
      return sec.name;
    },
    getMusicPic(off){
      let tmp = JSON.stringify(this.musicList[(this.currentPage - 1)*this.number + off])
      if(tmp === undefined)return "";
      let sec = JSON.parse(tmp);
      return sec.coverImgUrl;
    },
    getMusicsByListId(off){
      let tmp = JSON.stringify(this.musicList[(this.currentPage - 1)*this.number + off])
      if(tmp === undefined)return "";
      let sec = JSON.parse(tmp).id;
      let config = {
        params:{
          id : sec,
          timeStamp: Date.parse(new Date()) / 1000
        }
      };
      musicListCardGetMusicsByListId(config).then(res =>{
        this.musics = res.data.result;
        this.musicListName = this.getMusicName(off);
        this.drawer = true;
      });
    },
    setMusic(val){
      let config = {
        params:{
          id : val.id,
          timeStamp: Date.parse(new Date()) / 1000
        }
      };
      musicListCardFindMusicIfAccessible(config).then(res =>{
        if(res.data.success) {
          config.params = {
            id : val.id,
            timeStamp: Date.parse(new Date()) / 1000,
            level: 'exhigh'
          };
          musicListCardGetMusicUrl(config).then(async res => {
            let tmp = res.data.data;
            let url = tmp[0].url;
            await this.$emit('change', "musicUrl", url);
            await this.$emit('change', "musicId", val.id);
            await this.$emit('change', "musicNowTime", 0);
            await this.$emit('change', "musicState", 'pause');
            await this.$emit('change', "musicName", val.name);
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message
          });
        }
      })
    },
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
        <el-card :body-style="{ padding: '0px' }" shadow="hover" @click="getMusicsByListId(index)">
          <div class="img_cover">
            <img
                :src="getMusicPic(index)"
                class="image"/>
            <div class="cover">
              <el-icon class="cover_img" size="100px"><videoPlay/></el-icon>
            </div>
          </div>
          <div style="height:40px;font-size: small">
            <span id="musicListName">{{getMusicName(index)}}</span>
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
    <el-drawer
        :title="musicListName"
        v-model="drawer"
        :direction="rtl"
        :size="600"
    >
      <el-table
          :data="musics"
          height="100%"
          highlight-current-row
          @row-dblclick = setMusic
          style="width: 100%">
        <el-table-column prop="name" label="歌曲名" width="180"/>
        <el-table-column prop="ar" label="歌手名" width="100" />
        <el-table-column prop="al" label="专辑" />
      </el-table>
    </el-drawer>
  </div>
</template>

<style scoped>
.cardIndex {
  width: 80%;
  margin: 0 auto;
  text-align: center;
}
.image {
  width: 100%;
  text-align: center;
  margin: 0 auto;
}
.musicCardSelector {
  margin: 0 auto;
  text-align: center;
}
.img_cover:hover{
  transition: all 1s;
  transform: scale(1.05);
}
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
.cover:hover  {
  transition: all 1s;
  opacity: 0.5;
}
.img_cover{
  position: relative;
  margin : 0 auto;
}
.cover_img{
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  z-index: 2;
}
</style>