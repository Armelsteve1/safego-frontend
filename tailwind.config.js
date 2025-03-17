/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#004aad",
        secondary: "#5de0e6",
        gradientStart: "#5de0e6",
        gradientEnd: "#004aad",
        background: "#f5f5f5",
        text: "#333333",
        error: "#FF3B30",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #5de0e6, #004aad)",
      },
    },
  },
  plugins: [],
};
