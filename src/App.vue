<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from "@/components/content/m-header/m-header";
import Tab from "@/components/content/tab/tab";
import Player from './views/player/player.vue';
export default {
  name: "App",
  components: {
    MHeader,
    Tab,
    Player,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
</style>