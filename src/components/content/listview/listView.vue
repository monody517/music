<template>
  <Scroll
    :datas="data"
    class="list-view"
    ref="listview"
    :listenScroll="listenscroll"
    @scroll="scroll"
    :probeType="probeType"
  >
    <ul>
      <li
        v-for="(group, index) in data"
        class="list-group"
        :key="index"
        ref="group"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
          @click="selectItem(item)"
            v-for="(item, index) in group.items"
            class="list-group-item"
            :key="index"
          >
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutMove"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :data-index="index"
          class="item"
          :key="index"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedtitle" ref="fixed">
      <div class="fixed-title">{{ fixedtitle }}</div>
    </div>
  </Scroll>
</template>

<script>
import Scroll from "@/components/common/scroll/Scroll";
import { getData } from "@/common/js/dom";

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  name: "listView",
  components: {
    Scroll,
  },
  data() {
    return {
      currentIndex: 0,
      listenscroll: true,
      scrollY: -1,
      probeType: 3,
      diff: -1,
    };
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  created() {
    this.touch = {};
    this.listHeight = [];
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        if (group.title) {
          return group.title.substr(0, 1);
        }
      });
    },
    fixedtitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    },
  },
  methods: {
    selectItem(item){
      this.$emit('select',item)
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.$refs.listview.scrollToElement(this.$refs.group[index], 0);
      this.scrollY = -this.listHeight[index];
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.group;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      let fristTouch = e.touches[0];
      this.touch.y1 = fristTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutMove(e) {
      let fristTouch = e.touches[0];
      this.touch.y2 = fristTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      let listHeight = this.listHeight;
      if (newY >= 0) {
        this.currentIndex = 0;
        return;
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    },
  },
};
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.list-view {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: $color-background;
}

.list-group {
  padding-bottom: 30px;
}

.list-group-title {
  height: 30px;
  line-height: 30px;
  font-size: $font-size-small;
  color: $color-text-l;
  background: $color-highlight-background;
  padding-left: 20px;
}

.list-group-item {
  display: flex;
  align-items: center;
  padding: 20px 0 0 30px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.name {
  margin-left: 20px;
  color: $color-text-l;
  font-size: $font-size-medium;
}

.list-shortcut {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: $color-background-d;
  font-family: Helvetica;
}

.item {
  padding: 3px;
  line-height: 1;
  color: $color-text-l;
  font-size: $font-size-small;
}

&.current {
  color: $color-theme;
}

.list-fixed {
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
}

.fixed-title {
  height: 30px;
  line-height: 30px;
  font-size: $font-size-small;
  color: $color-text-l;
  background: $color-highlight-background;
  padding-left: 20px;
}
</style>