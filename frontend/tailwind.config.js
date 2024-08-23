/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bpegrey: "#202123",
        bpelightgrey: "#131315",
        bpegreen: "#53DD6C",
        bpeblack: "#0A0A0B",
        tokenpurple: "#362a59",
        tokengreen: "#3c6d46",
        tokenred: "#732e31",
        tokenyellow: "#75592a",
        tokenblue: "#225c73",
      },
      fontFamily: {
        inter: ["Inter"],
      },
    },
  },
  plugins: [],
};
