<!--  -->
<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 1,
    },
    click: {
      type: Boolean,
      default: true,
    },
    datas: {
      type: Array,
      default: [],
    },
  },
  mounted() {
    setTimeout(() => {
      this._initscroll();
    }, 20);
  },

  methods: {
    _initscroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
      });
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
  },
  watch: {
    datas() {
      setTimeout(() => {
        this.refresh(); 
      }, 20);
    },
  },
};
</script>
<style scoped>
</style>