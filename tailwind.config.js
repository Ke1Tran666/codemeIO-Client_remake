/** @type {import('tailwindcss').Config} */
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
  plugins: [],
  darkMode: 'selector',
}

