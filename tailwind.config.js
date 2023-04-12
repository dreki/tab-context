/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/ui.html",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /bg-(gray|blue|red|yellow|green|pink|purple|cyan|orange)-.*/
    },
    {
      pattern: /text-(gray|blue|red|yellow|green|pink|purple|cyan|orange)-.*/
    }
  ],
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
}
