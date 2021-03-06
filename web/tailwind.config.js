module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./public/**/*.html', , 'src/**/*.vue'],
  },
  theme: {
    height: {
      header: '50px',
      screen: '100vh',
      'screen-1/2': '50vh',
      'screen-1/4': '25vh',
      full: '100%',
      '1/2': '50%',
    },
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%',
      '200': '200px',
      '300': '300px',
      '400': '400px',
      '540': '540px',
      header: '50px',
    },
    maxHeight: {
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%',
      '400': '400px',
      '500': '500px',
      '600': '600px',
      header: '50px',
      screen: '100vh',
    },
    maxWidth: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%',
      xl: '1024px',
      header: '50px',
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
