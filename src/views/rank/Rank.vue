<template>
  <div class="rank">
    <div class="top-list">
      <ul>
        <li
          v-for="(item, index) in topList"
          :key="index"
          class="item"
          @click="topSelect(item)"
        >
          <div class="icon">
            <img v-lazy="item.picUrl" width="120" />
          </div>
          <div class="text">
            <ul>
              <li
                v-for="(sitem, index) in item.songList"
                :key="index"
                class="desc"
              >
                <p class="songname">{{ sitem.songname }}</p>
                -
                <p class="singername">{{ sitem.singername }}</p>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from "@/network/rank";
import { mapMutations } from "vuex";
export default {
  name: "Rank",
  data() {
    return {
      topList: [],
      topListId: null,
      
    };
  },
  mounted() {
    this._getTopList();
  },
  methods: {
    _getTopList() {
      getTopList().then((res) => {
        this.topList = res.data.topList;
        console.log(this.topList);
      });
    },
    topSelect(item) {
      this.$router.push({
        path: `/rank/${item.id}`,
      });
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: "SET_TOP_LIST",
    }),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.item {
  height: 120px;
  display: flex;
  width: 90%;
  margin: 10px auto;
  background: $color-dialog-background;

  .text {
    width: 200px;

    .desc {
      margin: 20px 5px;
      display: flex;
      font-size: $font-size-small;
      color: $color-text-d;

      .songname {
        margin-right: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .singername {
        width: 100px;
        margin-left: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>