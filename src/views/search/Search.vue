<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchBox ref="searchBox" @query="queryChange"></searchBox>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <div class="hotKey">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              @click="addQuery(item.k)"
              v-for="(item, index) in hotKey"
              :key="index"
            >
              {{ item.k }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result">
        <SuggestList :query="query"></SuggestList>
    </div>
  </div>
</template>

<script>
import { getHotKey } from "@/network/search";
import SearchBox from "./childComps/SearchBox";
import SuggestList from "./childComps/SuggestList";
export default {
  name: "Search",
  components: {
    SearchBox,
    SuggestList,
  },
  data() {
    return {
      hotKey: [],
      query:''
    };
  },
  mounted() {
    this._getHotKey();
  },
  methods: {
    _getHotKey() {
      getHotKey().then((res) => {
        this.hotKey = res.data.hotkey.slice(0, 10);
        console.log(this.hotKey);
      });
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    queryChange(query){
        this.query=query
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.hotKey {
  margin: 0 20px 20px 20px;

  .title {
    margin: 20px 0;
    font-size: $font-size-medium;
    color: $color-text-l;
  }

  .item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background: $color-highlight-background;
    font-size: $font-size-medium;
    color: $color-text-d;
  }
}
</style>