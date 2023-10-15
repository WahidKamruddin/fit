import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'matcha' : {
          100: '#a0b682',
          200: '#abb085',
          300: '#98ac6f',
          400: '#617b5b'
        }
      }
    },
  },
  plugins: [],
}
export default config
