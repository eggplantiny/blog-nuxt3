<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useContent, useRoute } from '#imports'
import { useToCStore } from '~/stores/ToC'

const observer = ref<IntersectionObserver>(null)
const tocStore = useToCStore()

onMounted(async () => {
  console.log('onMounted')
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id')
        if (entry.isIntersecting)
          tocStore.setActiveToC(id)
      })
    },
    {
      root: null,
      threshold: 0,
    },
  )

  document
    .querySelectorAll('main h2[id], main h3[id]')
    .forEach((section) => {
      observer.value.observe(section)
    })
})

onBeforeUnmount(() => {
  console.log('onBeforeUnmount')
  observer.value.disconnect()
})
</script>

<template>
  <main ref="mainRef" class="content prose min-w-0">
    <ContentDoc ref="contentDocRef" />
  </main>
</template>

<style scoped lang="scss">

</style>
