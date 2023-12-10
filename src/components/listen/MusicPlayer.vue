<script>
import {defineComponent} from "vue";
import Lyric from 'lyriccloudmusic'
import {CaretLeft, CaretRight, VideoPause, VideoPlay} from "@element-plus/icons-vue";
let lyricEl = null;
let lyricListEl = null
export default defineComponent({
  name: "MusicPlayer",
  components: {CaretRight, CaretLeft, VideoPause, VideoPlay},
  props: {
    song: {
      type: String,
      default() {
        return "";
      }
    },
    lyric: {
      type: String,
      default() {
        return "";
      }
    },
    musicPic: {
      type: String,
      default() {
        return "";
      }
    },
    musicName: {
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
    musicNoise(val) {
      const audioElem = this.$el.querySelector('audio');
      audioElem.volunm = val / 100;
    },
    lyric(val){
      console.log(val);
      if(this.currentLyric !== ''){
        this.currentLyric.stop();
      }
      this.currentLyric = new Lyric(this.lyric,this.handleLyric);
    }
  },
  data() {
    return {
      playing: false,
      currentDuration: "00:00:00",
      currentTime: 0,
      percent: 0,
      second: 0,
      duration: "00:00:00",
      playingOrder: 0,
      showTooltip: false,
      showMuteTip: false,
      musicNoise: 50,
      currentLyric: '',
      // 当前播放行数  用来设置class
      currentLineNum: 0
    }
  },
  computed: {
    showToolTip1() {
      return this.showTooltip && this.playingOrder === 1;
    },
    showToolTip2() {
      return this.showTooltip && this.playingOrder === 2;
    },
    showToolTip0() {
      return this.showTooltip && this.playingOrder === 0;
    },
    isMuted() {
      return this.showMuteTip && this.musicNoise === 0;
    },
    notMuted1() {
      return this.showMuteTip && this.musicNoise > 0 && this.musicNoise <= 50;
    },
    notMuted2() {
      return this.showMuteTip && this.musicNoise > 50;
    }
  },
  methods: {
    handleLyric({lineNum}) {
      lyricEl = this.$refs.lyricContainer;
      lyricListEl = this.$refs.lyricListRef;
      this.currentLineNum = lineNum;
      if (!lyricListEl) {
        return
      }
      if (lineNum > 3) {
        const lineEl = lyricListEl.children[0]
        // 拿到行的高度
        const lineHeight= lineEl.clientHeight
        // 滚动到哪里呢  到一行高度*当前的行-3行
        lyricEl.scrollTo({
          top: lineHeight*(lineNum-3),
          left: 0,
          behavior: 'smooth'
        });
      }else {
        lyricEl.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    },
    play() {
      const audioElem = this.$el.querySelector('audio');
      this.playing = true;
      this.second = audioElem.duration;
      let s = parseInt(audioElem.duration % 60);
      let m = parseInt(audioElem.duration / 60) % 60;
      let h = parseInt(audioElem.duration / 60 / 60);
      this.duration = h + ":" + m + ":" + s;
      audioElem.play();
    },
    pause() {
      const audioElem = this.$el.querySelector('audio');
      this.playing = false;
      audioElem.pause();
      this.currentLyric.stop();
    },
    onTimeupdate(e) {
      this.currentTime = parseInt(e.target.currentTime);
    },
    async audioEnd() {
      await this.$emit('nextMusic', this.playingOrder);
      setTimeout(this.setPlay, 2000);
    },
    setPlay() {
      const audioElem = this.$el.querySelector('audio');
      audioElem.play();
      this.playing = true;
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this.$refs.progress.style.width = offsetWidth;
      this.$refs.progressBtn.style.left = offsetWidth;
      this.percent = offsetWidth / rect.width;
      this.$refs.maudio.currentTime = this.second * this.percent;
      this.currentLyric.stop();
    },
    //处理
    handle(val) {
      //毫秒数转为时分秒
      let s = val % 60
      let m = parseInt(val / 60) % 60;
      let h = parseInt(val / 60 / 60);
      this.currentDuration = h + ":" + m + ":" + s;
      this.percent = val / this.second;
      if(this.currentTime === 0) {
        lyricEl = this.$refs.lyricContainer;
        lyricEl.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
      this.currentLyric.seek(this.currentTime * 1000 + 100);
      if(this.musicState !== 'playing'){
        this.currentLyric.stop();
      }
    },
    async prev() {
      await this.$emit('prev');
      setTimeout(this.setPlay, 1500);
    },
    async next() {
      await this.$emit('next', this.playingOrder);
      setTimeout(this.setPlay, 1500);
    },
    changePlayingOrder() {
      this.playingOrder = this.playingOrder + 1;
      if (this.playingOrder >= 3) {
        this.playingOrder = 0;
      }
    },
    muted() {
      this.musicNoise = (this.musicNoise === 0 ? 50 : 0);
      const audioElem = this.$el.querySelector('audio');
      audioElem.muted = !audioElem.muted;
    }
  }
})
</script>

<template>
  <div>

    <div>
      <audio :src="song"
             style="display:none;"
             @timeupdate="onTimeupdate"
             @ended="audioEnd"
             ref="maudio"
             id="maudio"/>
    </div>
    <el-text class="musicNameDisplay">{{ musicName }}</el-text>
    <div class="picAndLyric">
      <div style="float: left;display: flex; flex-direction: column; align-items: center; height: 100%">
        <img v-if="musicPic" :src="musicPic" style="width: 300px;height: 300px"/>
      </div>
      <div class="lyric-container" ref="lyricContainer">
        <div class="content" ref="lyricListRef">
          <p class="text" :key="index" v-for="(line, index) in currentLyric.lines" :class="{'current': currentLineNum ===index}">
            {{line.txt}}
          </p>
          <p v-show="currentLyric === ''" style="text-align: center;">暂无歌曲</p>
        </div>
      </div>
    </div>
    <div class="progress-wrapper">
      <!-- 时间显示 -->
      <span class="time">{{ currentDuration }}|{{ duration }}</span>
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
    <div>
      <!--      <el-popover placement="top" :width="150" trigger="hover" style="padding: 0;margin:0 auto;text-align: center">-->
      <!--        <template #reference>-->
      <!--          <el-button circle @click="muted">-->
      <!--            <svg v-show="this.musicNoise===0" t="1695089010125" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2856" width="15" height="15"><path d="M251.264 682.666667H85.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V384a42.666667 42.666667 0 0 1 42.666666-42.666667h165.930667l225.877333-184.832a21.333333 21.333333 0 0 1 34.858667 16.512v677.973334a21.333333 21.333333 0 0 1-34.858667 16.512L251.306667 682.666667h-0.042667z m619.733333-170.666667l150.869334 150.869333-60.330667 60.330667L810.666667 572.330667l-150.869334 150.869333-60.330666-60.330667L750.336 512 599.466667 361.130667l60.330666-60.330667L810.666667 451.669333l150.869333-150.869333 60.330667 60.330667L870.997333 512z" p-id="2857"></path></svg>-->
      <!--            <svg v-show="this.musicNoise>0 && this.musicNoise<=50" t="1695088945117" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2713" width="15" height="15"><path d="M379.264 682.666667H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V384a42.666667 42.666667 0 0 1 42.666666-42.666667h165.930667l225.877333-184.832a21.333333 21.333333 0 0 1 34.858667 16.512v677.973334a21.333333 21.333333 0 0 1-34.858667 16.512L379.306667 682.666667h-0.042667z m425.557333 25.216l-60.672-60.672A170.325333 170.325333 0 0 0 810.666667 512c0-61.013333-32-114.56-80.213334-144.725333l61.397334-61.397334A255.573333 255.573333 0 0 1 896 512c0 78.592-35.413333 148.906667-91.178667 195.882667z" p-id="2714"></path></svg>-->
      <!--            <svg v-show="this.musicNoise>50" t="1695089053498" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3107" width="15" height="15"><path d="M251.264 682.666667H85.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V384a42.666667 42.666667 0 0 1 42.666666-42.666667h165.930667l225.877333-184.832a21.333333 21.333333 0 0 1 34.858667 16.512v677.973334a21.333333 21.333333 0 0 1-34.858667 16.512L251.306667 682.666667h-0.042667z m576.725333 176.384l-60.416-60.416A382.976 382.976 0 0 0 896 512a383.274667 383.274667 0 0 0-140.970667-297.301333l60.586667-60.586667A468.352 468.352 0 0 1 981.333333 512c0 137.514667-59.136 261.205333-153.344 347.050667z m-151.168-151.168l-60.672-60.672A170.325333 170.325333 0 0 0 682.666667 512c0-61.013333-32-114.56-80.213334-144.725333l61.397334-61.397334A255.573333 255.573333 0 0 1 768 512c0 78.592-35.413333 148.906667-91.178667 195.882667z" p-id="3108"></path></svg>-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--        <el-slider v-model="musicNoise" vertical height="200px" style="text-align:center" />-->
      <!--      </el-popover>-->
      <el-button circle @click="muted">
        <div>
          <svg v-show="this.musicNoise===0" t="1695089010125" class="icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="2856" width="15" height="15"
               @mouseover="showMuteTip = true"
               @mouseout="showMuteTip = false">
            <path
                d="M251.264 682.666667H85.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V384a42.666667 42.666667 0 0 1 42.666666-42.666667h165.930667l225.877333-184.832a21.333333 21.333333 0 0 1 34.858667 16.512v677.973334a21.333333 21.333333 0 0 1-34.858667 16.512L251.306667 682.666667h-0.042667z m619.733333-170.666667l150.869334 150.869333-60.330667 60.330667L810.666667 572.330667l-150.869334 150.869333-60.330666-60.330667L750.336 512 599.466667 361.130667l60.330666-60.330667L810.666667 451.669333l150.869333-150.869333 60.330667 60.330667L870.997333 512z"
                p-id="2857"></path>
          </svg>
          <div v-if="isMuted" class="tooltip">取消静音</div>
        </div>
        <div>
          <svg v-show="this.musicNoise>0 && this.musicNoise<=50" t="1695088945117" class="icon" viewBox="0 0 1024 1024"
               version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2713" width="15" height="15"
               @mouseover="showMuteTip = true"
               @mouseout="showMuteTip = false">
            <path
                d="M379.264 682.666667H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V384a42.666667 42.666667 0 0 1 42.666666-42.666667h165.930667l225.877333-184.832a21.333333 21.333333 0 0 1 34.858667 16.512v677.973334a21.333333 21.333333 0 0 1-34.858667 16.512L379.306667 682.666667h-0.042667z m425.557333 25.216l-60.672-60.672A170.325333 170.325333 0 0 0 810.666667 512c0-61.013333-32-114.56-80.213334-144.725333l61.397334-61.397334A255.573333 255.573333 0 0 1 896 512c0 78.592-35.413333 148.906667-91.178667 195.882667z"
                p-id="2714"></path>
          </svg>
          <div v-if="notMuted1" class="tooltip">静音</div>
        </div>
        <div>
          <svg v-show="this.musicNoise>50" t="1695089053498" class="icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="3107" width="15" height="15"
               @mouseover="showMuteTip = true"
               @mouseout="showMuteTip = false">
            <path
                d="M251.264 682.666667H85.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V384a42.666667 42.666667 0 0 1 42.666666-42.666667h165.930667l225.877333-184.832a21.333333 21.333333 0 0 1 34.858667 16.512v677.973334a21.333333 21.333333 0 0 1-34.858667 16.512L251.306667 682.666667h-0.042667z m576.725333 176.384l-60.416-60.416A382.976 382.976 0 0 0 896 512a383.274667 383.274667 0 0 0-140.970667-297.301333l60.586667-60.586667A468.352 468.352 0 0 1 981.333333 512c0 137.514667-59.136 261.205333-153.344 347.050667z m-151.168-151.168l-60.672-60.672A170.325333 170.325333 0 0 0 682.666667 512c0-61.013333-32-114.56-80.213334-144.725333l61.397334-61.397334A255.573333 255.573333 0 0 1 768 512c0 78.592-35.413333 148.906667-91.178667 195.882667z"
                p-id="3108"></path>
          </svg>
          <div v-if="notMuted2" class="tooltip">静音</div>
        </div>
      </el-button>
      <el-button circle @click="prev">
        <el-icon>
          <caretLeft/>
        </el-icon>
      </el-button>
      <el-button v-if="!playing" @click="play" circle>
        <el-icon>
          <videoPlay/>
        </el-icon>
      </el-button>
      <el-button v-if="playing" @click="pause" circle>
        <el-icon>
          <videoPause/>
        </el-icon>
      </el-button>
      <el-button circle @click="next">
        <el-icon>
          <caretRight/>
        </el-icon>
      </el-button>
      <el-button circle @click="changePlayingOrder">
        <div>
          <svg
              v-show="playingOrder === 1"
              t="1695087169608"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2858"
              width="15"
              height="15"
              @mouseover="showTooltip = true"
              @mouseout="showTooltip = false"
          >
            <path
                d="M256 170.666667h640a42.666667 42.666667 0 0 1 42.666667 42.666666v298.666667h-85.333334V256H256v128L42.666667 213.333333l213.333333-170.666666v128z m512 682.666666H128a42.666667 42.666667 0 0 1-42.666667-42.666666v-298.666667h85.333334v256h597.333333v-128l213.333333 170.666667-213.333333 170.666666v-128z"
                p-id="2859"
            ></path>
          </svg>
          <div v-if="showToolTip1" class="tooltip">单曲循环</div>
        </div>
        <div>
          <svg v-show="playingOrder===2" t="1695087206942" class="icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="2999" width="15" height="15"
               @mouseover="showTooltip = true"
               @mouseout="showTooltip = false">
            <path
                d="M768 763.008V682.666667l213.333333 128-213.333333 128v-89.173334a384 384 0 0 1-298.538667-228.906666L469.333333 620.373333l-0.128 0.256A384 384 0 0 1 116.266667 853.333333H85.333333v-85.333333h30.933334a298.666667 298.666667 0 0 0 274.517333-181.034667L422.912 512l-32.128-74.965333A298.666667 298.666667 0 0 0 116.266667 256H85.333333V170.666667h30.933334a384 384 0 0 1 352.938666 232.746666L469.333333 403.626667l0.128-0.256A384 384 0 0 1 768 174.506667V85.333333l213.333333 128-213.333333 128V260.992a298.666667 298.666667 0 0 0-220.117333 176.042667L515.754667 512l32.128 74.965333A298.666667 298.666667 0 0 0 768 763.008z"
                p-id="3000"></path>
          </svg>
          <div v-if="showToolTip2" class="tooltip">随机播放</div>
        </div>
        <div>
          <svg v-show="playingOrder===0" t="1695086874363" class="icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="2713" width="15" height="15"
               @mouseover="showTooltip = true"
               @mouseout="showTooltip = false">
            <path
                d="M725.333333 170.666667V88.234667a21.333333 21.333333 0 0 1 34.986667-16.426667l175.786667 146.474667a21.333333 21.333333 0 0 1-13.696 37.717333H85.333333V170.666667h640zM85.333333 768h853.333334v85.333333H85.333333v-85.333333z m0-298.666667h853.333334v85.333334H85.333333v-85.333334z"
                p-id="2714"></path>
          </svg>
          <div v-if="showToolTip0" class="tooltip">顺序播放</div>
        </div>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
p {
  display: block;
  margin: 0;
  padding: 10px;
  text-align: center;
  box-sizing: border-box;
}
.current{
  color: white;
}
.lyric-container {
  width: 300px;
  height: 100%;
  float: left;
  overflow: hidden;
  border-style: solid;
  border-width: 2px;
  border-color: rgb(182, 215, 215,0.2);
  background-color: rgb(182, 215, 215,0.2);
}
.musicNameDisplay {
  font-size: 100px;
  margin-bottom: 10px;
}
.progress-wrapper {
  display: flex;
  width: 80%;
  padding: 10px 0;
  align-items: center;
  margin: 0 auto;
}
.tooltip {
  position: absolute;
  background-color: #bbecfa;
  color: #000;
  padding: 15px;
  border-radius: 5px;
  z-index: 999;
}
.picAndLyric {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
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
