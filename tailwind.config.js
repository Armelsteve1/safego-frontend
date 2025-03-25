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
        neutral: "#A0A0A0",
        input: "#ffffff",
        lightHover: "#eaf4ff",
      },

      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #5de0e6, #004aad)",
      },
    },
  },
  plugins: [],
};
