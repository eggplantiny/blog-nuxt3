<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useToCStore } from '~/stores/ToC'
import { useContent } from '#imports'

const tocStore = useToCStore()
const { toc } = useContent()
const { currentActiveToC } = storeToRefs(tocStore)
</script>

<template>
  <aside class="py-8 lg:py-12 top-8 left-0 sticky">
    <div class="text-xl font-bold">
      table of contents
    </div>
    <ul v-if="toc && toc.links">
      <div class="py-2">
        <li
          v-for="link in toc.links"
          :key="link.text"
          class="ml-2 border-l border-indigo-300 hover:text-indigo-700"
        >
          <a
            :href="`#${link.id}`"
            class="block truncate py-1 text-sm lg:pr-3 pl-4"
            :class="[currentActiveToC === link.id ? 'text-indigo-700 font-bold' : 'text-gray-500']"
          >
            {{ link.text }}
          </a>
        </li>
      </div>
    </ul>
  </aside>
</template>
