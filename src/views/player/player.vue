<!--  -->
<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend.prevent="middleTouchEnd"
        >
          <div class="middle-l" ref="cd">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="img" :src="currentSong.image" />
              </div>
            </div>
            <div class="oneLyric">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll
            class="middle-r"
            ref="lyricList"
            :data="currentLyric && currentLyric.lines"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  class="text"
                  ref="lyricLine"
                  :class="{ current: currentLyricNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                >
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: dotActive === 'cd' }"></span>
            <span class="dot" :class="{ active: dotActive === 'lyric' }"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <Progress
              class="progress-bar-wrapper"
              :precent="precent"
              @percentChange="percentChange"
            >
            </Progress>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div @click="lastSong" class="i-left">
              <i class="icon-prev"></i>
            </div>
            <div @click="play" class="i-center">
              <i :class="playIcon"></i>
            </div>
            <div @click="nextSong" class="i-right">
              <i class="icon-next"></i>
            </div>
            <div class="i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdCls" />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div @click.stop="play" class="control">
          <ProgressCircle :radius="radius" :precent="precent">
            <i class="icon-mini" :class="playIcon"></i>
          </ProgressCircle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
    <PlayList ref="playlist"></PlayList>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "@/common/js/dom.js";
import Progress from "./childComps/Progress";
import PlayList from "./childComps/PlayList";
import ProgressCircle from "./childComps/ProgressCircle";
import { playMode } from "@/common/js/config.js";
import { shuffle } from "@/common/js/util.js";
import Lyric from "lyric-parser";
import Scroll from "@/components/common/scroll/Scroll";

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
  name: "player",
  components: {
    Progress,
    ProgressCircle,
    PlayList,
    Scroll,
  },
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLyricNum: 0,
      dotActive: "cd",
      playingLyric: "",
    };
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playList",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
    ]),
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    precent() {
      return this.currentTime / this.currentSong.duration;
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
  },
  created() {
    this.touch = {};
  },
  methods: {
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    showPlayList() {
      this.$refs.playlist.show();
    },
    enter(el, done) {
      const { x, y, scale } = this.getPosAndSCale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`,
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`,
        },
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear",
        },
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this.getPosAndSCale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style.transform = "";
    },
    getPosAndSCale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingTop;
      return {
        x,
        y,
        scale,
      };
    },
    play() {
      this.setPlayingState(!this.playing);
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.nextSong();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentSong(list);
      this.setPlayList(list);
    },
    resetCurrentSong(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    lastSong() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.setPlayingState(!this.playing);
      }
    },
    nextSong() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playList.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.setPlayingState(!this.playing);
      }
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    percentChange(percent) {
      const audio = this.$refs.audio;
      audio.currentTime = percent * this.currentSong.duration;
      if (this.playing === false) {
        this.setPlayingState(!this.playing);
      }
    },
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric);
        if (this.playing) {
          this.currentLyric.play();
        }
      }).catch(() => {
        this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
      });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLyricNum = lineNum;
      if (lineNum > 5) {
        let lenEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lenEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    middleTouchStart(e) {
      this.touch.initiated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;

      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      const left = this.dotActive === "cd" ? 0 : -window.innerWidth;
      const offSetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offSetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offSetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      this.$refs.cd.style.opacity = 1 - this.touch.percent;
      this.$refs.cd.style[transitionDuration] = 0;
    },
    middleTouchEnd(e) {
      let offSetWidth;
      let opacity;
      if (this.dotActive === "cd") {
        if (this.touch.percent > 0.1) {
          offSetWidth = -window.innerWidth;
          this.dotActive = "lyric";
          opacity = 0;
        } else {
          offSetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offSetWidth = 0;
          this.dotActive = "cd";
          opacity = 1;
        } else {
          offSetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offSetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.cd.style.opacity = opacity;
      this.$refs.cd.style[transitionDuration] = `${time}ms`;
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_MODE",
      setPlayList: "SET_PLAY_LIST",
    }),
    format(interVal) {
      interVal = interVal | 0;
      const minute = (interVal / 60) | 0;
      const second = this._pad(interVal % 60);
      return `${minute}:${second}`;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
  },
  watch: {
    currentSong(oldSong, newSong) {
      this.timer = setTimeout(() => {
        if (oldSong.id === newSong.id) {
          return;
        }
        this.$refs.audio.play();
        this.getLyric();
      }, 1000);
    },
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.timer = setTimeout(() => {
        newPlaying ? audio.play() : audio.pause();
      }, 500);
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.normal-player {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: $color-background;

  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);
  }

  .top {
    position: relative;
    margin-bottom: 25px;

    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;

      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
    }

    .title {
      width: 70%;
      margin: 0 auto;
      line-height: 40px;
      text-align: center;
    }

    .subtitle {
      line-height: 20px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text;
    }
  }

  .middle {
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    white-space: nowrap;
    font-size: 0;

    .middle-l {
      display: inline-block;
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 80%;
      vertical-align: top;

      .cd-wrapper {
        position: absolute;
        left: 10%;
        top: 0;
        width: 80%;
        height: 100%;
      }

      .cd {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: 10px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        overflow: hidden;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }

      .oneLyric {
        display: inline-block;
        width: 80%;
        margin: 30px 10%;
        text-align: center;

        .playing-lyric {
          height: 30px;
          line-height: 30px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
    }

    .middle-r {
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .lyric-wrapper {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;

        .text {
          line-height: 32px;
          color: $color-text-l;
          font-size: $font-size-medium;

          &.current {
            color: $color-text;
          }
        }
      }
    }
  }

  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;

    .dot-wrapper {
      text-align: center;

      .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $color-text-l;

        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text-ll;
        }
      }
    }

    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      margin: 0px auto;
      padding: 10px 0;

      .time {
        color: $color-text;
        font-size: $font-size-small;
        flex: 0 0 30px;
        line-height: 30px;
        width: 30px;

        &.time-l {
          text-align: left;
        }

        &.time-r {
          text-align: right;
        }
      }

      .progress-bar-wrapper {
        flex: 1;
      }
    }

    .operators {
      display: flex;
      color: $color-theme;

      .i-left {
        flex: 1;
        font-size: 30px;
        text-align: right;
        line-height: 44px;
      }

      .i-center {
        flex: 1;
        font-size: 40px;
        text-align: center;
        padding: 0 20px;
      }

      .i-right {
        flex: 1;
        font-size: 30px;
        text-align: left;
        line-height: 44px;
      }
    }
  }
}

&.normal-enter-active, &.normal-leave-active {
  transition: all 0.4s;

  .top, .bottom {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}

&.normal-enter, &.normal-leave-to {
  opacity: 0;

  .top {
    transform: translate3d(0, -100px, 0);
  }

  .bottom {
    transform: translate3d(0, 100px, 0);
  }
}

.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;

  .icon {
    flex: 0 0 40px;
    width: 40px;
    padding: 0 10px 0 20px;
  }

  img {
    border-radius: 50%;

    &.play {
      animation: rotate 10s linear infinite;
    }

    &.pause {
      animation-play-state: paused;
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;

    .name {
      margin-bottom: 2px;
    }
  }

  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    font-size: 30px;
    color: $color-theme-d;

    .icon-mini {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 32px;
    }

    .icon-playlist {
    }
  }

  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.4s;
  }

  &.mini-enter, &.mini-leave-to {
    opacity: 0;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>