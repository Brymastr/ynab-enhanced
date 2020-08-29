module.exports = {
  purge: [],
  theme: {
    height: {
      header: '50px',
      screen: '100vh',
      full: '100%',
      '1/2': '50%',
    },
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%',
      '400': '400px',
    },
    maxWidth: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%',
      xl: '1024px',
    },
    extend: {
      gridTemplateRows: {
        '6': 'repeat(6, min-content)',
      },
      transitionProperty: {
        height: 'height',
        transform: 'transform',
      },
    },
  },
  variants: {
    margin: ['first', 'last', 'responsive'],
    padding: ['first', 'last', 'responsive'],
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
  },
};
