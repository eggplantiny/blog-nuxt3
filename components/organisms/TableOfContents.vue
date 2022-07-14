<script lang="ts" setup>
import { onMounted, ref, useContent } from '#imports'

const { toc } = useContent()
</script>

<template>
  <div class="py-8 lg:py-12 top-8 left-0 sticky">
    <div class="text-xl font-bold">
      table of contents
    </div>
    <ul v-if="toc && toc.links">
      <li v-for="link in toc.links" :key="link.text" class="group min-w-0">
        <a
          :href="`#${link.id}`"
          class="block truncate py-1 text-sm lg:pr-3 text-primary-500 pl-4"
        >
          {{ link.text }}
        </a>
      </li>
    </ul>
  </div>
</template>
