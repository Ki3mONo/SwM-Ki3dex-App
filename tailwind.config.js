/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        pokemon: ["PokemonHollow"],
      },
      colors: {
        primary: "#07224E",
        secondary: "#1A1E3F",
        searchBar: "#2D356F",
        white: "#FFFFFF",
        red: "#E21C25",
        grey: "#BCBDC0",
        pokeText: "#FFCB05",
        pokeTextSecondary: "#3D7DCA",
      },
    },
  },
  plugins: [],
};
