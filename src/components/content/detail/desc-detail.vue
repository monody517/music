<!--  -->
<template>
  <transition name="slide" appear>
    <div class="desc-detail">
      <MusicList :title="title" :bgImg="bgImg" :songs="songs"></MusicList>
    </div>
  </transition>
</template>

<script>
import MusicList from "@/components/content/music-list/MusicList";
import { getSongList } from "@/network/recommend";
import { mapGetters } from "vuex";
import { createSong } from "@/common/js/song";

export default {
  name: "DescDetail",
  components: {
    MusicList,
  },
  data() {
    return {
      songs: [],
    };
  },
  mounted() {
    this._getSongList();
  },
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImg() {
      return this.disc.imgurl;
    },
    ...mapGetters(["disc"]),
  },
  methods: {
    _getSongList() {
      getSongList(this.disc.dissid).then((res) => {       
        const data = res.data.cdlist[0];
        this.songs = this._normalizeSongs(data.songlist);
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((musicData) => {
        
        const songid= musicData.id 
        const albummid = musicData.ksong.mid
        
        if (songid && albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.desc-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}
</style>