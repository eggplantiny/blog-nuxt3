import { defineStore } from 'pinia'
import { ref } from '#imports'

export const useToCStore = defineStore('ToC', () => {
  const currentActiveToC = ref<string>()

  function setActiveToC(id: string) {
    currentActiveToC.value = id
  }

  return {
    currentActiveToC,
    setActiveToC,
  }
})
