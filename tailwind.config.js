export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
    }
  },
  plugins: [],
  safelist: [
    { pattern: /^(w-|h-)/ },
    { pattern: /^grid-cols-/ },
    { pattern: /^border-(t|r|b|l)-[0-9]+$/ },
  ],
}

