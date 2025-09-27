/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}", // include your Expo Router app folder
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};