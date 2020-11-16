<!--  -->
<template>
  <transition name="slide" appear>
    <div class="singer-detail">
      <MusicList :title="title" :bgImg="bgImg" :songs="song"></MusicList>
    </div>
  </transition>
</template>

<script>
import MusicList from "@/components/content/music-list/MusicList";
import { getSingerDetail } from "@/network/singer";
import { createSong } from "@/common/js/song";
import { mapGetters } from "vuex";

export default {
  name: "SingerDetail",
  components: {
    MusicList,
  },
  data() {
    return {
      song: [],
      title: "",
      bgImg: "",
    };
  },
  computed: {
    // title() {
    //   return this.singer.name;
    // },
    // bgImg() {
    //   return this.singer.avatar;
    // },
    ...mapGetters(['singer'])
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer")
        return
      console.log(this.singer);
      }
      getSingerDetail(this.singer.id).then((res) => {
        this.song = this._normalizeSongs(res.data.list);
        this.title = res.data.singer_name;
        this.bgImg = this.singer.avatar;
        console.log(this.song);
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((item) => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
  },
  created() {
    this._getDetail();
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

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}
</style>