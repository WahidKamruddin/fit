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
        'mocha' : {
          100: '#E9DDC8',
          150: '#BCAC92',
          200: '#D9D0C1',
          250: '#D2CBC3',
          300: '#CDB38F',
          400: '#A28769',
          500: '#634832'
        },
        
        'off-white' : {
          100: '#F9F9F9'
        }
      },
      fontFamily: {
        nunito: ['Nunito']        
      }
    },
  },
  plugins: [],
}
export default config
