<script setup lang="ts">
import { useContent } from '#imports'

const { navigation } = useContent()
</script>

<template>
  <nav class="py-8 lg:py-12 top-8 left-0 sticky">
    <ul>
      <template v-for="(upper, upperIndex) in navigation" :key="upperIndex">
        <li class="text-gray-900 group w-full items-center justify-between py-1.5 text-xl font-bold">
          {{ upper.title }}

          <ul class="py-2">
            <template v-for="(lower, lowerIndex) in upper.children" :key="lowerIndex">
              <li class="ml-2 border-l border-indigo-300 hover:border-indigo-500">
                <NuxtLink :to="`${lower._path}`" class="flex items-center justify-between py-1.5 text-sm pl-4 text-gray-500 hover:text-indigo-700">
                  <span class="inline-flex items-center">{{ lower.title }}</span>
                </NuxtLink>
              </li>
            </template>
          </ul>
        </li>
      </template>
    </ul>
  </nav>
</template>

<style scoped lang="scss">

</style>
