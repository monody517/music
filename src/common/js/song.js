import { getLyric } from '@/network/song'
import { ERR_OK } from '@/network/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    // 当已经请求过歌词时，不必再请求
    if (this.lyric) {
      return Promise(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        // 解码base64数据
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
          console.log(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid || musicData.id,
    mid: musicData.songmid || musicData.ksong.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname || musicData.name,
    album: musicData.albumname || musicData.album.name,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid || musicData.album.mid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    url: `http://isure.stream.qqmusic.qq.com/C4000043aj132xwlEf.m4a?guid=6690626051&vkey=37663DD73021068BC071E1A6041652DFBC5FA8DA3AFD8770A998B35DA65290DBAC4C3742CB9B83D41A614483D21BFC63B449FA747C390C12&uin=0&fromtag=66`,

  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

