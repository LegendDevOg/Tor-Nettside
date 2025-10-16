/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Professional, cohesive color palette
        primary: {
          50: '#eef2ff',
          100: '#dce3ff',
          200: '#c1ccff',
          300: '#9baeff',
          400: '#3d5dc4',
          500: '#2b4ba8', // Main blue - custom color (default state)
          600: '#3d5dc4', // Lighter blue for hover
          700: '#1d3073',
          800: '#16245a',
          900: '#0f1840',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Main green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#de5858', // Main red - custom color
          600: '#c94d4d',
          700: '#b43e3e',
          800: '#991b1b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Main amber
          600: '#d97706',
          700: '#b45309',
        },
      },
    },
  },
  plugins: [],
};
