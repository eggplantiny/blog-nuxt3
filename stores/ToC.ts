import { defineStore } from 'pinia'
import { shallowRef } from '@vue/reactivity'

export interface ToC {
  id: string
  depth: number
  text: string
}

export const useToCStore = defineStore('ToC', () => {
  const tocRef = shallowRef<ToC[]>([])

  function updateToC(tocList: ToC[]) {
    tocRef.value = tocList
  }

  function getToC() {
    return tocRef.value
  }

  return {
    tocRef,
    getToC,
    updateToC,
  }
})
