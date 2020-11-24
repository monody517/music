<template>
  <div class="recommend">
    <Scroll class="recommend-content" :datas="discList" ref="scroll">
      <div>
        <div v-if="swiperlist.length" class="slider-wrapper">
          <swiper>
            <div v-for="(item, index) in swiperlist" :key="index">
              <a :href="item.linkUrl"></a>
              <img :src="item.picUrl" @load="loadImg" />
            </div>
          </swiper>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门推荐</h1>
          <ul>
            <li
              v-for="(item, index) in discList"
              :key="index"
              class="item"
              @click="descSelect(item)"
            >
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Swiper from "@/components/common/swiper/Swiper";
import Scroll from "@/components/common/scroll/Scroll";
import { getRecommend, getDiscList } from "@/network/recommend";
import { mapMutations } from "vuex";
import { ERR_OK } from "@/network/config";

export default {
  name: "Recommend",
  components: {
    Swiper,
    Scroll,
  },
  data() {
    return {
      swiperlist: [],
      discList: [],
      checkLoaded: false,
    };
  },

  mounted() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    ...mapMutations({
      setDisc: "SET_DISC",
    }),
    descSelect(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`,
      });
      this.setDisc(item);
    },
    loadImg() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.swiperlist = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>