import *as types from './mutation-type'
import {playMode} from "@/common/js/config.js"
import { shuffle } from "@/common/js/util.js"

export const selectplay = function ({ commit, state }, { list, index }) {
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING, true)
}

export const randomplay = function ({ commit }, { list }) {
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_SEQUENCE_LIST, list)
  const randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING, true)
  commit(types.SET_MODE,playMode.random)
} 