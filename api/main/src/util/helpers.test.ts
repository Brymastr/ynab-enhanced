import { sortDates, groupTransactionsByDate, createPeriodicNetWorth } from './helpers';
import { PeriodicTransactions, Transaction, WorthDate } from './Ynab';

describe('groupTransactionsByDate', () => {
  test('by month, in order', () => {
    const input: Transaction[] = [
      { id: '1', date: '2021-01-31', amount: 101000 },
      { id: '2', date: '2021-01-31', amount: 102000 },
      { id: '3', date: '2021-01-31', amount: 103000 },
      { id: '4', date: '2021-02-28', amount: 104000 },
      { id: '5', date: '2021-02-28', amount: 105000 },
      { id: '6', date: '2021-03-31', amount: 106000 },
    ];

    const expected: PeriodicTransactions = {
      '2021-01-31': [
        { id: '1', date: '2021-01-31', amount: 101000 },
        { id: '2', date: '2021-01-31', amount: 102000 },
        { id: '3', date: '2021-01-31', amount: 103000 },
      ],
      '2021-02-28': [
        { id: '4', date: '2021-02-28', amount: 104000 },
        { id: '5', date: '2021-02-28', amount: 105000 },
      ],
      '2021-03-31': [{ id: '6', date: '2021-03-31', amount: 106000 }],
    };

    const actual = groupTransactionsByDate(input, 'month');

    expect(actual).toStrictEqual(expected);
  });
  test('by month, out of order', () => {
    const input: Transaction[] = [
      { id: '5', date: '2021-02-28', amount: 105 },
      { id: '1', date: '2021-01-31', amount: 101 },
      { id: '6', date: '2021-03-31', amount: 106 },
      { id: '3', date: '2021-01-31', amount: 103 },
      { id: '4', date: '2021-02-28', amount: 104 },
      { id: '2', date: '2021-01-31', amount: 102 },
    ];

    const expected: PeriodicTransactions = {
      '2021-01-31': [
        { id: '1', date: '2021-01-31', amount: 101 },
        { id: '3', date: '2021-01-31', amount: 103 },
        { id: '2', date: '2021-01-31', amount: 102 },
      ],
      '2021-02-28': [
        { id: '5', date: '2021-02-28', amount: 105 },
        { id: '4', date: '2021-02-28', amount: 104 },
      ],
      '2021-03-31': [{ id: '6', date: '2021-03-31', amount: 106 }],
    };

    const actual = groupTransactionsByDate(input, 'month');

    expect(actual).toStrictEqual(expected);
  });
});

describe('sortDates', () => {
  test('expected output', () => {
    // keys are out of order
    const input: PeriodicTransactions = {
      '2021-02-28': [
        { id: '3', date: '2021-02-28', amount: 201 },
        { id: '4', date: '2021-02-28', amount: 202 },
      ],
      '2021-01-31': [
        { id: '1', date: '2021-01-31', amount: 101 },
        { id: '2', date: '2021-01-31', amount: 102 },
      ],
    };

    // keys should be in order of date ascending
    const expected: [string, Transaction[]][] = [
      [
        '2021-01-31',
        [
          { id: '1', date: '2021-01-31', amount: 101 },
          { id: '2', date: '2021-01-31', amount: 102 },
        ],
      ],
      [
        '2021-02-28',
        [
          { id: '3', date: '2021-02-28', amount: 201 },
          { id: '4', date: '2021-02-28', amount: 202 },
        ],
      ],
    ];
    const actual = sortDates(input);

    expect(actual).toStrictEqual(expected);
  });
});

describe('createPeriodicNetWorth', () => {
  describe('includePrevious', () => {
    const allTransactions: Transaction[] = [
      { id: '1', date: '2021-01-01', amount: 101000 },
      { id: '2', date: '2021-01-02', amount: 102000 },
    ];
    test('true', () => {
      const expected: WorthDate[] = [
        {
          date: '2021-01-01',
          worth: 101,
          previous: undefined,
        },
        {
          date: '2021-01-02',
          worth: 203,
          previous: {
            date: '2021-01-01',
            worth: 101,
          },
        },
      ];

      const actual = createPeriodicNetWorth(allTransactions, 'day', true);

      expect(actual).toEqual(expected);
    });
    test('false', () => {
      const expected: WorthDate[] = [
        {
          date: '2021-01-01',
          worth: 101,
        },
        {
          date: '2021-01-02',
          worth: 203,
        },
      ];

      const actual = createPeriodicNetWorth(allTransactions, 'day', false);

      expect(actual).toEqual(expected);
    });
    test('undefined (default false)', () => {
      const expected: WorthDate[] = [
        {
          date: '2021-01-01',
          worth: 101,
        },
        {
          date: '2021-01-02',
          worth: 203,
        },
      ];

      const actual = createPeriodicNetWorth(allTransactions, 'day');

      expect(actual).toEqual(expected);
    });
  });

  describe('monthly', () => {
    const allTransactions: Transaction[] = [
      { id: '1', date: '2021-01-31', amount: 101000 },
      { id: '2', date: '2021-01-31', amount: 102000 },
      { id: '3', date: '2021-01-31', amount: 103000 },
      { id: '4', date: '2021-02-28', amount: 104000 },
      { id: '5', date: '2021-02-28', amount: 105000 },
      { id: '6', date: '2021-03-31', amount: 106000 },
    ];
    test('no previous', () => {
      const expected: WorthDate[] = [
        {
          date: '2021-01-31',
          worth: 306,
        },
        {
          date: '2021-02-28',
          worth: 515,
        },
        {
          date: '2021-03-31',
          worth: 621,
        },
      ];

      const actual = createPeriodicNetWorth(allTransactions, 'month');

      expect(actual).toEqual(expected);
    });
    test('previous', () => {
      const expected: WorthDate[] = [
        {
          date: '2021-01-31',
          worth: 306,
          previous: undefined,
        },
        {
          date: '2021-02-28',
          worth: 515,
          previous: {
            date: '2021-01-31',
            worth: 306,
          },
        },
        {
          date: '2021-03-31',
          worth: 621,
          previous: {
            date: '2021-02-28',
            worth: 515,
          },
        },
      ];

      const actual = createPeriodicNetWorth(allTransactions, 'month', true);

      expect(actual).toEqual(expected);
    });
  });

  describe('daily', () => {
    const allTransactions: Transaction[] = [
      { id: '1', date: '2021-01-01', amount: 101000 },
      { id: '2', date: '2021-01-01', amount: 102000 },
      { id: '3', date: '2021-01-02', amount: 103000 },
      { id: '4', date: '2021-01-03', amount: 104000 },
      { id: '5', date: '2021-01-03', amount: 105000 },
      { id: '6', date: '2021-01-04', amount: 106000 },
      { id: '7', date: '2021-01-05', amount: 107000 },
      { id: '8', date: '2021-01-06', amount: 108000 },
      { id: '9', date: '2021-01-06', amount: 109000 },
      { id: '10', date: '2021-01-07', amount: 110000 },
      { id: '11', date: '2021-01-08', amount: 111000 },
      { id: '12', date: '2021-01-09', amount: 112000 },
    ];

    test('no previous', () => {
      const expected: WorthDate[] = [
        {
          date: '2021-01-01',
          worth: 203,
        },
        {
          date: '2021-01-02',
          worth: 306,
        },
        {
          date: '2021-01-03',
          worth: 515,
        },
        {
          date: '2021-01-04',
          worth: 621,
        },
        {
          date: '2021-01-05',
          worth: 728,
        },
        {
          date: '2021-01-06',
          worth: 945,
        },
        {
          date: '2021-01-07',
          worth: 1055,
        },
        {
          date: '2021-01-08',
          worth: 1166,
        },
        {
          date: '2021-01-09',
          worth: 1278,
        },
      ];

      const actual = createPeriodicNetWorth(allTransactions, 'day');

      expect(actual).toEqual(expected);
    });

    test('previous', () => {
      const expected: WorthDate[] = [
        {
          date: '2021-01-01',
          worth: 203,
          previous: undefined,
        },
        {
          date: '2021-01-02',
          worth: 306,
          previous: {
            date: '2021-01-01',
            worth: 203,
          },
        },
        {
          date: '2021-01-03',
          worth: 515,
          previous: {
            date: '2021-01-02',
            worth: 306,
          },
        },
        {
          date: '2021-01-04',
          worth: 621,
          previous: {
            date: '2021-01-03',
            worth: 515,
          },
        },
        {
          date: '2021-01-05',
          worth: 728,
          previous: {
            date: '2021-01-04',
            worth: 621,
          },
        },
        {
          date: '2021-01-06',
          worth: 945,
          previous: {
            date: '2021-01-05',
            worth: 728,
          },
        },
        {
          date: '2021-01-07',
          worth: 1055,
          previous: {
            date: '2021-01-06',
            worth: 945,
          },
        },
        {
          date: '2021-01-08',
          worth: 1166,
          previous: {
            date: '2021-01-07',
            worth: 1055,
          },
        },
        {
          date: '2021-01-09',
          worth: 1278,
          previous: {
            date: '2021-01-08',
            worth: 1166,
          },
        },
      ];

      const actual = createPeriodicNetWorth(allTransactions, 'day', true);

      expect(actual).toEqual(expected);
    });
  });
});
