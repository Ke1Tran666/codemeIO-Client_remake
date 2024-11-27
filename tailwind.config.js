/** @type {import('tailwindcss').Config} */
import aspectRatio from '@tailwindcss/aspect-ratio';

export default {
  mode: "jit",
  content: ["./src/**/**/*.jsx"],
  theme: {
    extend: {
      boxShadow: {
        'custom-1': '0px 1px 3px 0px #0000000d',
      },
      colors: {
        'primary': 'rgba(44, 143, 255, 1)'
      }
    },
  },
  plugins: [aspectRatio],
  darkMode: 'selector',
}