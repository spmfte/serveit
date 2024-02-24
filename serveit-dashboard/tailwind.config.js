module.exports = {
  darkMode: 'class', // Use class to toggle dark mode manually
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        dark: '#121212',
        accent: '#BB86FC',
        primary: '#121212',
        secondary: '#1F1F1F',
        tertiary: '#252525',
      },
      boxShadow: {
        // Neumorphism
        neumorphism: '8px 8px 16px #0a0c0d, -8px -8px 16px #141617',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // Oversized typography for headings
            h1: {
              fontSize: '3rem',
              fontWeight: '700',
              lineHeight: theme('lineHeight.tight'),
            },
            // Distinct font styles for mixing fonts
            h2: {
              fontSize: '2.25rem',
              fontWeight: '500',
              fontFamily: '"Open Sans", sans-serif',
            },
            p: {
              fontFamily: '"Roboto", sans-serif',
            },
          },
        },
      }),
      spacing: {
        // Spacing for layout control, especially for 3D elements
        '13': '3.25rem', // 52px
        '15': '3.75rem', // 60px
      },
      borderRadius: {
        // Bauhaus and retro UI with geometric and rounded shapes
        large: '1.5rem', // 24px
      },
      transitionProperty: {
        // Properties for microinteractions
        colors: 'color, backgroundColor, borderColor, textDecorationColor, fill, stroke',
        opacity: 'opacity',
        shadow: 'boxShadow',
        transform: 'transform',
      },
      animation: {
        // Keyframes for microinteractions
        bounce: 'bounce 1s infinite',
      },
      // Include any other customizations for the trends mentioned
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
  // Include additional configuration for plugins if necessary
};
