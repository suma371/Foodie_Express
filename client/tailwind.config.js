/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FC8019",        // Swiggy-like orange
        primaryDark: "#E46F12",
        secondary: "#282C3F",      // dark text / navbar
        accent: "#60B246",         // success / veg indicator
        background: "#F8F8F8",     // page background
        card: "#FFFFFF",
        border: "#E9E9EB",
        muted: "#686B78",          // secondary text
        rating: "#48C479",         // rating green
        danger: "#E23744"
      },

      fontFamily: {
        sans: ["'Poppins'", "system-ui", "sans-serif"],
      },

      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "26px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["30px", "36px"],
      },

      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
        hover: "0 4px 16px rgba(0,0,0,0.12)",
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [],
}
