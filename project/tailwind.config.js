/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{njk,md,js}", 
    "./src/**/*.svg",
    "./src/**/*.css"
  ],
  //
  theme: {
    extend: {},
  },
  // 
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
