/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens: {
      desktop: { max: "1200px" },
      tab: { max: "800px" },
      mobile: { max: "475px" },
    },
  },
  plugins: [],
};
