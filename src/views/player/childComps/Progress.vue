<!--  -->
<template>
  <div class="progress-bar" ref="bar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="btn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "@/common/js/dom.js";

const transform = prefixStyle("transform");
export default {
  name: "Progress",
  props: {
    precent: {
      type: Number,
      default: 0,
    },
  },
  created() {
    this.touch = {};
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        this.$refs.bar.clientWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this.offset(offsetWidth);
    },
    progressTouchEnd() {
      this.touch.initiated = false;
      const btnwidth = this.$refs.btn.clientWidth;
      const barwidth = this.$refs.bar.clientWidth - btnwidth;
      const percent = this.$refs.progress.clientWidth / barwidth;
      this.$emit("percentChange", percent);
    },
    offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.btn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
    },
    progressClick(e) {
      this.offset(e.offsetX);
      const btnwidth = this.$refs.btn.clientWidth;
      const barwidth = this.$refs.bar.clientWidth - btnwidth;
      const percent = this.$refs.progress.clientWidth / barwidth;
      this.$emit("percentChange", percent);
    },
  },
  watch: {
    precent(newPrecent) {
      if (newPrecent >= 0 && !this.touch.initiated) {
        const btnwidth = this.$refs.btn.clientWidth;
        const barwidth = this.$refs.bar.clientWidth - btnwidth;
        const offsetwidth = newPrecent * barwidth;
        this.offset(offsetwidth);
      }
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 4px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>