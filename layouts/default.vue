<script setup lang="ts">
import Sidebar from '~/components/organisms/Sidebar.vue'
import TableOfContents from '~/components/organisms/TableOfContents.vue'
</script>

<template>
  <div class="relative antialiased">
    <!-- Header -->

    <!-- Body -->
    <div class="container !max-w-screen-2xl lg:px-6 mx-auto grid-layout">
      <!-- Sidebar -->
      <Sidebar />

      <div class="grid px-6 md:px-8 py-8 lg:py-12 relative">
        <!-- Content -->
        <slot />
      </div>

      <div>
        <TableOfContents />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
