import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['**/*.{vue,html,jsx,tsx,md}'],
    exclude: ['node_modules', '.git'],
  },
})
