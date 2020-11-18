<!--  -->
<template>
  <div class="song-list">
    <div class="song-list-item" v-for="(song, index) in songs" :key="index" @click="selectSong(song,index)">
      <div class="rank">
        <i></i>
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
  },
  data() {
    return {};
  },
  methods: {
    getDesc(song) {
      return `${song.singer}.${song.album}`;
    },
    selectSong(song,index) {
      this.$emit('select',song,index)
    }
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
  border-bottom 0.5px solid $color-text-d
}
.content{
    flex: 1;
    line-height :20px
}
.song-name {
  color: $color-text;
}

.song-desc {
  margin-top: 4px;
  color: $color-text-d;
}
</style>