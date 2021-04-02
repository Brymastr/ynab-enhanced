import numeral from 'numeral'

const locales = [
  {
    name: 'CAD',
    delimiters: {
      thousands: ',',
      decimal: '.'
    },
    abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't'
    },
    ordinal: function (number: number) {
      const b = number % 10
      return ~~((number % 100) / 10) === 1
        ? 'th'
        : b === 1
          ? 'st'
          : b === 2
            ? 'nd'
            : b === 3
              ? 'rd'
              : 'th'
    },
    currency: {
      symbol: '$'
    }
  },
  {
    name: 'USD',
    delimiters: {
      thousands: ',',
      decimal: '.'
    },
    abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't'
    },
    ordinal: function (number: number) {
      const b = number % 10
      return ~~((number % 100) / 10) === 1
        ? 'th'
        : b === 1
          ? 'st'
          : b === 2
            ? 'nd'
            : b === 3
              ? 'rd'
              : 'th'
    },
    currency: {
      symbol: '$'
    }
  }
]

export default function () {
  for (const locale of locales) {
    const { name, ...rest } = locale
    numeral.register('locale', name, rest)
  }
}
