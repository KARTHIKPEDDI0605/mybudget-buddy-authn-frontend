/** @type {import('tailwindcss').Config} */
module.exports = {
  fullySpecified: false,
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
