<script>
import {defineComponent} from "vue";
import SideBar from "@/components/SideBar.vue";
import MusicPlayer from "@/components/listentogether/MusicPlayer.vue";
import {tgoCreateRoom, tgoDelRoom, tgoGetRoom, tgoUpdateRoom} from "@/request/listentogether";
import {ElMessageBox} from "element-plus";
import MusicListCard from "@/components/listentogether/MusicListCard.vue";

export default defineComponent({
  name: "ListenTogetherView",
  components: {MusicListCard, MusicPlayer, SideBar},
  created() {
    this.judgeRoom();
  },
  data(){
    return{
      song:'',
      songID:'',
      testSongName:'',
      songPic:'',
      hasRoom:false,
      enterRoom:false,
      enterRoomShow:false,
      roomId:'',
      enterRoomForm:{
        room:''
      },
      timer:null,
      musicNowTime:0,
      musicState:''
    }
  },
  methods: {
    createRoom() {
      let profile = JSON.parse(localStorage.getItem("profile"));
      if (profile === null || profile === undefined) {
        this.$message({
          type: 'error',
          message: '您还未登陆，请先登陆!'
        });
      } else {
        let params = {
          uid: profile.userId
        }
        tgoCreateRoom(params).then(res => {
          if (res.data.code !== '00000') {
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          } else {
            this.hasRoom = true;
            localStorage.setItem("room", profile.userId);
            this.roomId = profile.userId;
            this.judgeRoom();
            this.$message({
              type: 'success',
              message: '创建成功！'
            });
          }
        })
      }
    },
    delRoom() {
      let profile = JSON.parse(localStorage.getItem("profile"));
      if (profile === null || profile === undefined) {
        this.$message({
          type: 'error',
          message: '您还未登陆，请先登陆!'
        });
      } else {
        let params = {
          uid: profile.userId
        }
        tgoDelRoom(params).then(res => {
          if (res.data.code !== '00000') {
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          } else {
            this.hasRoom = false;
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            let room = localStorage.getItem("room");
            if (room !== null && room !== undefined) {
              localStorage.removeItem("room");
            }
            this.musicState = 'pause';
            this.musicNowTime = 0;
            this.testSongName = 'testSong';
          }
        })
      }
    },
    judgeRoom() {
      let room = localStorage.getItem("room");
      if (room === null || room === undefined) {
        //
      } else {
        let params = {
          uid: room
        }
        tgoGetRoom(params).then(res => {
          console.log(res);
          if (res.data.result !== null) {
            this.roomId = room;
            let profile = JSON.parse(localStorage.getItem("profile"));
            if (profile === null || profile === undefined) {
              this.$message({
                type: 'error',
                message: '您还未登陆，请先登陆!'
              });
            } else {
              if (room == profile.userId) {
                this.hasRoom = true;
                this.enterRoom = false;
              } else {
                this.enterRoom = true;
                this.hasRoom = false;
              }
              this.watchMusic();
            }
          } else {
            localStorage.removeItem("room");
            this.hasRoom = false;
            this.enterRoom = false;
          }
        })
      }
    },
    enterARoom() {
      this.enterRoomShow = true;
    },
    existRoom() {
      this.enterRoom = false;
      this.roomId = '';
      localStorage.removeItem('room');
      this.musicState = 'pause';
      this.musicNowTime = 0;
      this.testSongName = 'testSong';
    },
    enterRoomSubmit() {
      let params = {
        uid: this.enterRoomForm.room
      };
      tgoGetRoom(params).then(res => {
        if (res.data.result !== null) {
          this.room = this.enterRoomForm.room;
          this.enterRoom = true;
          this.enterRoomShow = false;
          localStorage.setItem("room", this.enterRoomForm.room);
          this.judgeRoom();
          this.$message({
            type: 'success',
            message: '加入成功！'
          });
        } else {
          this.$message({
            type: 'warning',
            message: '房间不存在！'
          });
        }
      })

    },
    watchMusic() {
      if (this.enterRoom || this.hasRoom) {
        this.timer = setInterval(() => {
          if (!this.enterRoom && !this.hasRoom) {
            clearInterval(this.timer);
          }
          let room = localStorage.getItem("room");
          let params = {
            uid: room
          }
          tgoGetRoom(params).then(res => {
            if (res.data.result === null) {
              ElMessageBox.alert('这个房间已经关闭了', '啊欧', {
                confirmButtonText: '我知道了',
              })
              clearInterval(this.timer);
            } else {
              this.song = res.data.result.musicUrl;
              this.musicNowTime = Number(res.data.result.musicNowTime);
              this.musicState = res.data.result.musicState;
              this.songId = res.data.result.musicId;
              this.testSongName = res.data.result.musicName;
              this.songPic = res.data.result.musicPic;
            }
          })
        }, 1000)
      }
    },
    async costPlannedAmountChange(key,value) {
      if(key === 'newMusicFlag'){
        setTimeout(this.$refs.music.play,2000);
      } else {
        let params = {
          key: key,
          value: value,
          uid: this.roomId
        }
        tgoUpdateRoom(params).then(res => {
          if (res.data.code !== '00000') {
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          }
        })
      }
    },
    async getNextMusicByOrder(value){
      await this.$refs.card.getNextMusicByOrder(value);
    },
    async getNextMusic(){
      await this.$refs.card.getNextMusicByOrder(0);
    },
    async getPrevMusic(){
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
      <el-main>
        <div>
          <el-text size="large">ListenTogether</el-text>
        </div>
        <div>
          <el-text v-show="hasRoom||enterRoom">您当前的房间号:{{roomId}}</el-text>
        </div>
        <div>
          <el-button v-show="!hasRoom && !enterRoom" @click="createRoom">创建房间</el-button>
          <el-button v-show="hasRoom && !enterRoom" @click="delRoom">关闭房间</el-button>
          <el-button v-show="!hasRoom && !enterRoom" @click="enterARoom">加入房间</el-button>
          <el-button v-show="!hasRoom && enterRoom" @click="existRoom">退出房间</el-button>
        </div>
        <div v-show="hasRoom||enterRoom">
          <div>
            <img :src="songPic" style="width: 20%;height: 20%"/>
          </div>
          <el-text>{{testSongName}}</el-text>
          <MusicPlayer :song="song"
                       :music-now-time="musicNowTime"
                       :music-state="musicState"
                       @change="costPlannedAmountChange"
                       @nextMusic="getNextMusicByOrder"
                       @next="getNextMusic"
                       @prev="getPrevMusic"
                       ref="music"/>
        </div>
        <el-dialog v-model="enterRoomShow" title="加入房间">
          <el-form :model="enterRoomForm">
            <el-form-item label="房间号" label-width='100px' required>
              <el-input v-model="enterRoomForm.room" autocomplete="off" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="enterRoomShow = false">Cancel</el-button>
              <el-button type="primary" @click="enterRoomSubmit">
                Confirm
              </el-button>
            </span>
          </template>
        </el-dialog>
        <div v-show="hasRoom||enterRoom">
          <MusicListCard @change="costPlannedAmountChange" ref="card" style="margin-top: 5%"/>
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
</style>