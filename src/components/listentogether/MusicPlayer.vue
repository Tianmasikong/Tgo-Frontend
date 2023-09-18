<script>
import {defineComponent} from "vue";
import {VideoPause, VideoPlay} from "@element-plus/icons-vue";

export default defineComponent({
  name: "MusicPlayer",
  components: {VideoPause, VideoPlay},
  props:{
      song: {
        type: String,
        default() {
          return "";
        }
      },
      musicNowTime: {
        type: Number,
        default() {
          return 0;
        }
      },
      musicState: {
        type: String,
        default() {
          return "";
        }
      }
  },
  watch: {
    //进度条变化
    percent(val) {
      let value = parseInt(val * 100) + "%";
      this.$refs.progress.style.width = value;
      this.$refs.progressBtn.style.left = parseInt(val * 100 - 2) + "%";
    },
    currentTime(val) {
      this.handle(val);
    },
    musicNowTime(val){
      this.remoteHandle(val);
    },
    musicState(val){
      this.playing = val == "playing";
      if(this.playing){
        this.play();
      }else{
        this.pause();
      }
    },
  },
  created() {
    this.touch = {};
  },
  data() {
    return {
      playing: false,
      currentDuration: "00:00:00",
      currentTime: 0,
      percent: 0,
      second: 0,
      duration:"00:00:00"
    }
  },
  methods:{
    playInterNal() {
      const audioElem = this.$el.querySelector('audio');
      audioElem.play();
      this.playing = true;
      this.second = audioElem.duration;
      let s = parseInt(audioElem.duration % 60);
      let m = parseInt(audioElem.duration / 60) % 60;
      let h = parseInt(audioElem.duration / 60 / 60);
      this.duration = h + ":" + m + ":" + s;
    },
    play() {
      const audioElem = this.$el.querySelector('audio');
      audioElem.play();
      this.playing = true;
      this.second = audioElem.duration;
      let s = parseInt(audioElem.duration % 60);
      let m = parseInt(audioElem.duration / 60) % 60;
      let h = parseInt(audioElem.duration / 60 / 60);
      this.duration = h + ":" + m + ":" + s;
      this.$emit('change',"musicState","playing");
    },
    pause() {
      const audioElem = this.$el.querySelector('audio');
      audioElem.pause();
      this.playing = false;
      this.$emit('change',"musicState","pause");
    },
    onTimeupdate(e) {
      this.currentTime = parseInt(e.target.currentTime);
    },
    audioEnd() {
      this.playing = false;
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this.$refs.progress.style.width = offsetWidth;
      this.$refs.progressBtn.style.left = offsetWidth;
      this.percent = offsetWidth / rect.width;
      this.$refs.maudio.currentTime = this.second * this.percent;
      this.$emit('change',"musicNowTime",parseInt(this.second * this.percent));
    },
    //处理
    handle(val) {
      //毫秒数转为时分秒
      let s = val % 60
      let m = parseInt(val / 60) % 60;
      let h = parseInt(val / 60 / 60);
      this.currentDuration = h + ":" + m + ":" + s;
      this.percent = val / this.second;
    },
    remoteHandle(val) {
      const audioElem = this.$el.querySelector('audio');
      this.second = audioElem.duration;
      let s = val % 60
      let m = parseInt(val / 60) % 60;
      let h = parseInt(val / 60 / 60);
      this.currentDuration = h + ":" + m + ":" + s;
      this.percent = val / this.second;
      this.$refs.maudio.currentTime = this.second * this.percent;
    }
  }
})
</script>

<template>
  <div>

    <audio :src="song"
           style="display:none;"
           @timeupdate="onTimeupdate"
           @ended="audioEnd"
           ref="maudio"
           id="maudio"/>
    <div class="progress-wrapper">
      <!-- 时间显示 -->
      <span class="time">{{currentDuration}}|{{duration}}</span>
      <div class="progress-bar-wrapper">
        <div class="progress-bar" ref="progressBar" @click="progressClick">
          <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn">
              <div class="progress-btn"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-button v-if="!playing" @click="play" circle>
      <el-icon><videoPlay/></el-icon>
    </el-button>
    <el-button v-if="playing" @click="pause" circle>
      <el-icon><videoPause/></el-icon>
    </el-button>
  </div>
</template>

<style scoped>
.progress-wrapper {
  display: flex;
  align-items: center;
  width: 60%;
  margin: 0 auto;
  padding: 10px 0;

  .progress-bar-wrapper {
    flex: 1;
    margin-right: 5px;

    .progress-bar {
      height: 30px;
      cursor: pointer;

      .bar-inner {
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(238, 229, 255, 1);

        .progress {
          position: absolute;
          height: 100%;
          background-color: #bc99ff;
        }

        .progress-btn-wrapper {
          position: absolute;
          left: -8px;
          top: -13px;
          width: 30px;
          height: 30px;

          .progress-btn {
            position: relative;
            top: 7px;
            left: 7px;
            box-sizing: border-box;
            width: 16px;
            height: 16px;
            border: 3px solid #fff;
            border-radius: 50%;
            background: #bc99ff;
            }
          }
        }
      }
    }
  .time {
    color: rgb(132, 80, 229);
    font-size: 12px;
    width: 110px;
    text-align: left;
  }
}
</style>