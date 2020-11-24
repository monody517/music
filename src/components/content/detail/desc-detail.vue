<!--  -->
<template>
  <transition name="slide" appear>
    <div class="desc-detail">
      <MusicList :title="title" :bgImg="bgImg"></MusicList>
    </div>
  </transition>
</template>

<script>
import MusicList from "@/components/content/music-list/MusicList";
import { getSongList } from "@/network/recommend";
import { mapGetters } from "vuex";

export default {
  name: "DescDetail",
  components: {
    MusicList,
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
        console.log(res);
      });
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