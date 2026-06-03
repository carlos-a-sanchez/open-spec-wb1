import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          800: '#151929',
          900: '#0d101c',
          950: '#05060a',
        },
        coral: '#ff6f5b',
        lagoon: '#1dd3b0',
        amber: '#fbcf53',
        lilac: '#c7a3ff',
      },
      fontFamily: {
        sans: ['"Sora"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel:
          '0 20px 60px rgba(5, 6, 10, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
}

export default config
