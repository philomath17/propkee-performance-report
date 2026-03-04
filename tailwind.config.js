/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './data/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#B88917',
      },
      boxShadow: {
        card: '0 10px 30px -15px rgba(0, 0, 0, 0.18)',
      },
    },
  },
  plugins: [],
};
