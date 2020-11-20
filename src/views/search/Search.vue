<template>
  <div class="search"></div>
</template>

<script>
import {getHotKey} from "@/network/search"
export default {
    name:'Search',
    mounted() {
        this._getHotKey()
    },
    methods: {
        _getHotKey(){
            getHotKey().then((res) => {
                console.log(res)
            })
        }
    }
}
</script>

<style>

</style>