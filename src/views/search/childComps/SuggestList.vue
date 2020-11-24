<!--  -->
<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item">
        <div class="icon">
          <i></i>
        </div>
        <div class="name">
          <p class="text"></p>
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
        console.log(res);
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
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;
    }
  }
}
</style>