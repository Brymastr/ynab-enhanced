import {
  sortDates,
  groupTransactionsByDate,
  createPeriodicNetWorth,
  endOf,
  getEarliestTransaction,
  getLatestTransaction,
  add,
} from './helpers';
import { Granularity } from './types';
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
  test('by day, out of order, should fill gaps', () => {
    const input: Transaction[] = [
      { id: '1', date: '2021-01-03', amount: 105 },
      { id: '2', date: '2021-01-03', amount: 105 },
      { id: '3', date: '2021-01-05', amount: 101 },
      { id: '4', date: '2021-01-01', amount: 106 },
      { id: '5', date: '2021-01-07', amount: 103 },
      { id: '6', date: '2021-01-08', amount: 104 },
      { id: '7', date: '2021-01-08', amount: 104 },
    ];

    const expected: PeriodicTransactions = {
      '2021-01-03': [
        { id: '1', date: '2021-01-03', amount: 105 },
        { id: '2', date: '2021-01-03', amount: 105 },
      ],
      '2021-01-05': [{ id: '3', date: '2021-01-05', amount: 101 }],
      '2021-01-01': [{ id: '4', date: '2021-01-01', amount: 106 }],
      '2021-01-07': [{ id: '5', date: '2021-01-07', amount: 103 }],
      '2021-01-08': [
        { id: '6', date: '2021-01-08', amount: 104 },
        { id: '7', date: '2021-01-08', amount: 104 },
      ],
      '2021-01-04': [],
      '2021-01-02': [],
      '2021-01-06': [],
    };

    const actual = groupTransactionsByDate(input, 'day');

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

  describe('daily, gaps in transaction dates', () => {
    const allTransactions: Transaction[] = [
      { id: '1', date: '2021-01-01', amount: 101000 },
      { id: '2', date: '2021-01-01', amount: 102000 },
      // { id: '3', date: '2021-01-02', amount: 103000 },
      { id: '4', date: '2021-01-03', amount: 104000 },
      { id: '5', date: '2021-01-03', amount: 105000 },

      { id: '6', date: '2021-01-04', amount: 106000 },
      // { id: '7', date: '2021-01-05', amount: 107000 },
      { id: '8', date: '2021-01-06', amount: 108000 },
      { id: '9', date: '2021-01-06', amount: 109000 },
      // { id: '10', date: '2021-01-07', amount: 110000 },
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
          worth: 203,
        },
        {
          date: '2021-01-03',
          worth: 412,
        },
        {
          date: '2021-01-04',
          worth: 518,
        },
        {
          date: '2021-01-05',
          worth: 518,
        },
        {
          date: '2021-01-06',
          worth: 735,
        },
        {
          date: '2021-01-07',
          worth: 735,
        },
        {
          date: '2021-01-08',
          worth: 846,
        },
        {
          date: '2021-01-09',
          worth: 958,
        },
      ];

      const actual = createPeriodicNetWorth(allTransactions, 'day');

      expect(actual).toEqual(expected);
    });
  });
});

describe('endOf', () => {
  describe('full date', () => {
    const date = new Date('2021-07-20T20:00:40.480Z');

    test('day', () => {
      const expected = new Date('2021-07-20T23:59:59.999Z');

      const actual = endOf(date, 'day');

      expect(actual).toEqual(expected);
    });

    test('month', () => {
      const expected = new Date('2021-07-31T23:59:59.999Z');

      const actual = endOf(date, 'month');

      expect(actual).toEqual(new Date(expected));
    });
    test('year', () => {
      const expected = new Date('2021-12-31T23:59:59.999Z');

      const actual = endOf(date, 'year');

      expect(actual).toEqual(new Date(expected));
    });
  });

  describe('partial date', () => {
    const date = new Date('2021-07-20');

    test('day', () => {
      const expected = new Date('2021-07-20T23:59:59.999Z');

      const actual = endOf(date, 'day');

      expect(actual).toEqual(expected);
    });
    test('day 2', () => {
      const date2 = new Date('2021-01-01');
      const expected = new Date('2021-01-01T23:59:59.999Z');

      const actual = endOf(date2, 'day');

      expect(actual).toEqual(expected);
    });
    test('month', () => {
      const expected = new Date('2021-07-31T23:59:59.999Z');

      const actual = endOf(date, 'month');

      expect(actual).toEqual(expected);
    });
    test('year', () => {
      const expected = new Date('2021-12-31T23:59:59.999Z');

      const actual = endOf(date, 'year');

      expect(actual).toEqual(expected);
    });
  });
});

describe('add day', () => {
  const granularity: Granularity = 'day';
  test('start of month', () => {
    const input = new Date('2021-01-01T00:00:00.000Z');
    const expected = new Date('2021-01-02T00:00:00.000Z');
    const actual = add(input, granularity);

    expect(actual).toEqual(expected);
  });
  test('second last day of month', () => {
    const input = new Date('2021-01-30T00:00:00.000Z');
    const expected = new Date('2021-01-31T00:00:00.000Z');
    const actual = add(input, granularity);

    expect(actual).toEqual(expected);
  });
  test('end of month', () => {
    const input = new Date('2021-01-31T00:00:00.000Z');
    const expected = new Date('2021-02-01T00:00:00.000Z');
    const actual = add(input, granularity);

    expect(actual).toEqual(expected);
  });
  test('end of year', () => {
    const input = new Date('2021-12-31T00:00:00.000Z');
    const expected = new Date('2022-01-01T00:00:00.000Z');
    const actual = add(input, granularity);

    expect(actual).toEqual(expected);
  });
});

describe('add month', () => {
  const granularity: Granularity = 'month';
  test('start of month', () => {
    const input = new Date('2021-01-01T00:00:00.000Z');
    const expected = new Date('2021-02-01T00:00:00.000Z');
    const actual = add(input, granularity);

    expect(actual).toEqual(expected);
  });
  test('last day of february', () => {
    const input = new Date('2021-02-28T00:00:00.000Z');
    const expected = new Date('2021-03-28T00:00:00.000Z');
    const actual = add(input, granularity);

    expect(actual).toEqual(expected);
  });
  test('last day of april', () => {
    const input = new Date('2021-04-30T00:00:00.000Z');
    const expected = new Date('2021-05-30T00:00:00.000Z');
    const actual = add(input, granularity);

    expect(actual).toEqual(expected);
  });
  test('last day of january', () => {
    const input = new Date('2021-01-31T00:00:00.000Z');
    const expected = new Date('2021-02-28T00:00:00.000Z');
    const actual = add(input, granularity);

    expect(actual).toEqual(expected);
  });
  test('last day of december', () => {
    const input = new Date('2021-12-31T00:00:00.000Z');
    const expected = new Date('2022-01-31T00:00:00.000Z');
    const actual = add(input, granularity);

    expect(actual).toEqual(expected);
  });
});

describe('add year', () => {
  const granularity: Granularity = 'year';
  test('start of month', () => {
    const input = new Date('2021-01-01T00:00:00.000Z');
    const expected = new Date('2022-01-01T00:00:00.000Z');
    const actual = add(input, granularity);

    expect(actual).toEqual(expected);
  });
});

describe('getEarliestTransaction', () => {
  test('monthly, start of month', () => {
    const transactions: Transaction[] = [
      { id: '3', date: '2021-03-01', amount: 0 },
      { id: '5', date: '2021-05-01', amount: 0 },
      { id: '2', date: '2021-02-01', amount: 0 },
      { id: '1', date: '2021-01-01', amount: 0 },
      { id: '4', date: '2021-04-01', amount: 0 },
    ];

    const expected = new Date('2021-01-01');

    const actual = getEarliestTransaction(transactions);

    expect(actual).toEqual(expected);
  });

  test('monthly, end of month', () => {
    const transactions: Transaction[] = [
      { id: '3', date: '2021-03-31', amount: 0 },
      { id: '5', date: '2021-05-31', amount: 0 },
      { id: '2', date: '2021-02-31', amount: 0 },
      { id: '1', date: '2021-01-31', amount: 0 },
      { id: '4', date: '2021-04-30', amount: 0 },
    ];

    const expected = new Date('2021-01-31');

    const actual = getEarliestTransaction(transactions);

    expect(actual).toEqual(expected);
  });

  test('random days', () => {
    const transactions: Transaction[] = [
      { id: '3', date: '2021-03-31', amount: 0 },
      { id: '5', date: '2021-12-09', amount: 0 },
      { id: '2', date: '2022-04-23', amount: 0 },
      { id: '4', date: '2021-04-30', amount: 0 },
      { id: '1', date: '2021-01-03', amount: 0 },
    ];

    const expected = new Date('2021-01-03');

    const actual = getEarliestTransaction(transactions);

    expect(actual).toEqual(expected);
  });
});

describe('getLatestTransaction', () => {
  test('monthly, start of month', () => {
    const transactions: Transaction[] = [
      { id: '3', date: '2021-03-01', amount: 0 },
      { id: '5', date: '2021-05-01', amount: 0 },
      { id: '2', date: '2021-02-01', amount: 0 },
      { id: '1', date: '2021-01-01', amount: 0 },
      { id: '4', date: '2021-04-01', amount: 0 },
    ];

    const expected = new Date('2021-05-01');

    const actual = getLatestTransaction(transactions);

    expect(actual).toEqual(expected);
  });

  test('monthly, end of month', () => {
    const transactions: Transaction[] = [
      { id: '3', date: '2021-03-31', amount: 0 },
      { id: '5', date: '2021-05-31', amount: 0 },
      { id: '2', date: '2021-02-31', amount: 0 },
      { id: '1', date: '2021-01-31', amount: 0 },
      { id: '4', date: '2021-04-30', amount: 0 },
    ];

    const expected = new Date('2021-05-31');

    const actual = getLatestTransaction(transactions);

    expect(actual).toEqual(expected);
  });

  test('random days', () => {
    const transactions: Transaction[] = [
      { id: '3', date: '2021-03-31', amount: 0 },
      { id: '5', date: '2021-12-09', amount: 0 },
      { id: '2', date: '2022-04-23', amount: 0 },
      { id: '4', date: '2021-04-30', amount: 0 },
      { id: '1', date: '2021-01-03', amount: 0 },
    ];

    const expected = new Date('2022-04-23');

    const actual = getLatestTransaction(transactions);

    expect(actual).toEqual(expected);
  });
});
