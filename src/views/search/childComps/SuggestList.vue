<!--  -->
<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) in SuggestList"
        :key="index"
      >
        <div class="icon">
          <i></i>
        </div>
        <div class="name">
          <p class="text">{{ item.songname }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { search } from "@/network/search";
export default {
  name: "SuggestList",
  data() {
    return {
      page: 1,
      SuggestList: [],
    };
  },
  props: {
    query: {
      type: String,
      default: "",
    },
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    search() {
      search(this.query, this.page, this.showSinger).then((res) => {
        const data = res.data.data;
        console.log(data);
        this.SuggestList = data.song.list;
      });
    },
  },
  watch: {
    query() {
      this.search();
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.suggest {
  height: 100%, overflow hidden;

  .suggest-list {
    margin-top: -49px;
    padding: 0 30px;
    background: $color-background;
    color: $color-text-d;

    .suggest-item {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      height: 44px;
      font-size: $font-size-medium;
      border-bottom: 0.5px solid $color-text-d;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;
    }
  }
}
</style>