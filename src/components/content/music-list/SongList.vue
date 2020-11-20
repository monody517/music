<!--  -->
<template>
  <div class="song-list">
    <div
      class="song-list-item"
      v-for="(song, index) in songs"
      :key="index"
      @click="selectSong(song, index)"
    >
      <div class="rank" v-show="rank">
        <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
      </div>
      <div class="content">
        <h2 class="song-title">{{ song.name }}</h2>
        <p class="song-desc">{{ getDesc(song) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SongList",
  props: {
    songs: {
      type: Array,
      default: [],
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    getDesc(song) {
      return `${song.singer}.${song.album}`;
    },
    selectSong(song, index) {
      this.$emit("select", song, index);
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon${index}`;
      } else {
        return "text";
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.song-list-item {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  height: 64px;
  font-size: $font-size-medium;
  border-bottom: 0.5px solid $color-text-d;

  .rank {
    flex: 0 0 25px;
    width: 25px;
    margin-right: 30px;
    text-align: center;

    .icon0 {
      display: inline-block;
      width: 25px;
      height: 24px;
      background-size: 25px 24px;
      bg-image('first');
    }

    .icon1 {
      display: inline-block;
      width: 25px;
      height: 24px;
      background-size: 25px 24px;
      bg-image('second');
    }

    .icon2 {
      display: inline-block;
      width: 25px;
      height: 24px;
      background-size: 25px 24px;
      bg-image('third');
    }

    .text {
      color: $color-theme;
      font-size: $font-size-large;
    }
  }
}

.content {
  flex: 1;
  line-height: 20px;
}

.song-name {
  color: $color-text;
}

.song-desc {
  margin-top: 4px;
  color: $color-text-d;
}
</style>