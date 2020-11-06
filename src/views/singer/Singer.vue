<template>
  <div class="singer">
    <ListView :data="singers" @select="selectSinger"></ListView>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "@/network/singer";
import singer from "@/common/js/singer.js";
import ListView from "@/components/content/listview/listView";

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;
export default {
  name: "Singer",
  components: {
    ListView,
  },
  data() {
    return {
      singers: [],
    };
  },
  mounted() {
    this._getSingerList();
    setTimeout(() => {
      this.singers = this._normalizeSinger(this.singers);
    }, 1000);
  },
  methods: {
    selectSinger(singer) {
      this.$router.push({
        path:`/singer/${singer.id}`
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: [],
        },
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
              avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: [],
          };
        }
        map[key].items.push(
          new singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
          })
        );
      });
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    _getSingerList() {
      getSingerList().then((res) => {
        this.singers = res.data.list;
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>