<!--  -->
<template>
  <div class="rank-detail">
    <MusicList :rank="rank" :title="title" :bgImg="bgImg" :songs="songs"></MusicList>
  </div>
</template>

<script>
import MusicList from "@/components/content/music-list/MusicList";
import { getMusicList } from "@/network/rank";
import { createSong } from "@/common/js/song";
import { mapGetters } from "vuex";
export default {
  name: "RankDetail",
  components: {
    MusicList,
  },
  data() {
    return {
      title: "",
      songs: [],
      bgImg:"",
      rank:true
    };
  },
  computed: {
    ...mapGetters(["topList"]),
  },
  mounted() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      getMusicList(this.topList.id).then((res) => {
        console.log(res)
        this.title = res.topinfo.ListName;
        this.songs = this._normalizeSongs(res.songlist);
        this.bgImg = this.songs[0].image
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((item) => {
        let musicData = item.data;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
  },
};
</script>
<style scoped>
</style>