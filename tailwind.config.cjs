module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        neon: "0 0 8px #00FFFF, 0 0 16px #00FFFF",
        "neon-lg": "0 0 20px #00FFFF, 0 0 40px #00FFFF",
      },
    },
  },
  plugins: [],
};
