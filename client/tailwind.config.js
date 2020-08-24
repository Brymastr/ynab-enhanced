module.exports = {
  purge: [],
  theme: {
    height: {
      header: '50px',
      screen: '100vh',
    },
    extend: {
      gridTemplateRows: {
        '6': 'repeat(6, min-content)',
      },
      transitionProperty: {
        height: 'height',
      },
    },
  },
  variants: {
    margin: ['first', 'last'],
    padding: ['first', 'last'],
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
  },
};
