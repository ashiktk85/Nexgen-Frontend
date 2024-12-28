/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
module.exports = {
  content: [
    "./node_modules/@nextui-org/react/**/*.{js,ts,jsx,tsx}", // Add NextUI paths
    "./src/**/*.{js,ts,jsx,tsx}", // Your app's files
  ],
  theme: {
      extend: {
          fontFamily: {
              sans: ['Roboto', 'sans-serif'], // Replace default sans-serif
              inter: ['Inter', 'sans-serif'],
          },
          colors: {
            primary: "#0950a0", 
          },
      },
  },
  plugins: [nextui()],
};
