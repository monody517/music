import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function search (w, p) {
  let date = new Date().getTime()
  const url = 'api/search'
  return axios(url, {
    params: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      w: w,
      zhidaqu: 1,
      catZhida: 1,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      perpage: 20,
      n: 20,
      p: p,
      remoteplace: 'txt.mqq.all',
      _: date
    }
  }).then(res => {
    return res
  })
}