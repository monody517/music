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
    // if (this.lyric) {
    //   return Promise.resolve(this.lyric)
    // }

    // return new Promise((resolve, reject) => {
    //   getLyric(this.mid).then((res) => {
    //     if (res.retcode === ERR_OK) {
    //       this.lyric = Base64.decode(res.lyric)
    //       resolve(this.lyric)
    //     } else {
    //       reject('no lyric')
    //     }
    //   })
    // })
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    getLyric(this.mid).then((res) => {
      if (res.retcode === ERR_OK) {
        this.lyric = res.lyric
        console.log(this.lyric)
      }
    })
  }
}

export function getSongVkey(songmid, callback) {
  wx.request({
    url: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
    data: {
      // callback: 'musicJsonCallback',
      loginUin: 3051522991,
      format: 'jsonp',
      platform: 'yqq',
      needNewCode: 0,
      cid: 205361747,
      uin: 3051522991,
      guid: 5931742855,
      songmid: songmid,
      filename: 'C400' + songmid + '.m4a'
    },
    method: 'GET',
    header: {
      'content-Type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        console.log("请求VKey成功")
        console.log(res.data)
        callback(res.data);
      }
    }
  })
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    url: `http://ws.stream.qqmusic.qq.com/C400001CGh5Y1Wnuju.m4a?guid=6690626051&vkey=0AB99059070C64BA06E94119F7B1D6824E217CF343F9CE1FA6AF90EB87DA084FEAA463E404FFF5BC333BC96EB74B169369CCDB1619EE4A1D&uin=0&fromtag=66`
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

