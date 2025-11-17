/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./index.html", // make sure index.html is included if using Vite
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
],
  theme: {
    extend: {
      colors: {
        primary: "#0B6930", // your SabiGuy green
        secondary: "#F7F8FA", // light gray background
        accent: "#1E8E3E", // lighter green shade for hover
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // optional but clean
      },
    },
  },
  plugins: [],
  safelist: [
  'bg-primary',
  'hover:bg-primary',
  'text-white',
],
};

