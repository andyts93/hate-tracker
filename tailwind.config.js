import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        "brutal": "4px 4px 0px",
        "brutal-sm": "2px 2px 0px",
        "brutal-md": "6px 6px 0px",
        "brutal-lg": "8px 8px 0px"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
