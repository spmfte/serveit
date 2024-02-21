module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx}", // scan for .js and .jsx files in src
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors based on the UI reference
        'dark-blue': '#2c3e50',
        'light-blue': '#3498db',
        // You can continue adding more colors and extend other theme properties as needed
      },
      // Add any other theme extensions here
    },
  },
  plugins: [],
}

