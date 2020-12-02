<!--  -->
<template>
  <div class="playlist" v-show="showFlag" @click="hide">
    <div class="list-wrapper" @click.stop>
      <div class="list-header">
        <h1 class="title">
          <i class="icon" :class="iconMode" @click="changeMode"></i>
          <span class="text"></span>
          <span class="clear"><i class="icon-clear"></i></span>
        </h1>
      </div>
      <Scroll ref="listContent" class="list-content">
        <ul>
          <li
            ref="listItem"
            class="item"
            v-for="(item, index) in sequenceList"
            :key="index"
            @click="selectSong(item, index)"
          >
            <i class="current" :class="getCurrentSong(item)"></i>
            <span class="text" v-html="item.name"></span>
            <span class="like">
              <i class="icon-not-favorite"></i>
            </span>
            <span class="delete" @click.stop="deleteOne(item)">
              <i class="icon-delete"></i>
            </span>
          </li>
        </ul>
      </Scroll>
      <div class="list-operate">
        <div class="add">
          <i class="icon-add"></i>
          <span class="text">添加歌曲到队列</span>
        </div>
      </div>
      <div class="list-close" @click="hide">
        <span>关闭</span>
      </div>
    </div>
  </div>
</template>

<script>
import { playMode } from "@/common/js/config.js";
import { mapGetters, mapMutations, mapActions } from "vuex";
import Scroll from "@/components/common/scroll/Scroll";
import { shuffle } from "@/common/js/util.js";
export default {
  name: "PlayList",
  data() {
    return {
      showFlag: false,
    };
  },
  components: {
    Scroll,
  },
  computed: {
    ...mapGetters(["mode", "sequenceList", "currentSong", "playlist"]),
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      });
    },
    hide() {
      this.showFlag = false;
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
      this.setPlayList(list);
      this.resetCurrentSong(list);
    },
    resetCurrentSong(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    getCurrentSong(item) {
      if (this.currentSong.id === item.id) {
        return "icon-play";
      } else {
        return "";
      }
    },
    selectSong(item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id;
      });
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
    deleteOne(item) {
      this.deleteSong(item)
      },
    ...mapMutations({
      setPlayMode: "SET_MODE",
      setPlayList: "SET_PLAY_LIST",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayingState: "SET_PLAYING",
    }),
    ...mapActions([
      'deleteSong'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      this.scrollToCurrent(newSong);
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      padding: 20px 30px 10px 20px;
      position: relative;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .clear {
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        .current {
          margin-right: 5px;
          font-size: $font-size-small;
          color: $color-theme;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .like {
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
        }

        .delete {
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }

    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>