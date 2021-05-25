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
  const groupTransactionsByDateMock = jest.fn();
  const sortDatesResponse: PeriodicTransactions = {
    '2021-01-31': [
      { id: '1', date: '2021-01-31', amount: 101000 },
      { id: '2', date: '2021-01-31', amount: 102000 },
      { id: '3', date: '2021-01-31', amount: 103000 },
    ],
    '2021-02-28': [
      { id: '4', date: '2021-02-28', amount: 104000 },
      { id: '5', date: '2021-02-28', amount: 105000 },
    ],
    '2021-03-31': [{ id: '6', date: '2021-03-31', amount: 106 }],
  };
  const sortDatesMock = jest.fn().mockReturnValue(sortDatesResponse);

  jest.mock('./helpers', () => ({
    ...jest.requireActual('./helpers'),
    sortDates: sortDatesMock,
    groupTransactionsByDate: groupTransactionsByDateMock,
  }));

  test('simple, monthly', () => {
    const allTransactions: Transaction[] = [
      { id: '1', date: '2021-01-31', amount: 101000 },
      { id: '2', date: '2021-01-31', amount: 102000 },
      { id: '3', date: '2021-01-31', amount: 103000 },
      { id: '4', date: '2021-02-28', amount: 104000 },
      { id: '5', date: '2021-02-28', amount: 105000 },
      { id: '6', date: '2021-03-31', amount: 106000 },
    ];

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

    const actual = createPeriodicNetWorth(allTransactions, 'month');

    expect(actual).toEqual(expected);
  });
  test('simple, monthly', () => {
    const allTransactions: Transaction[] = [
      { id: '1', date: '2021-01-31', amount: 101000 },
      { id: '2', date: '2021-01-31', amount: 102000 },
      { id: '3', date: '2021-01-31', amount: 103000 },
      { id: '4', date: '2021-02-28', amount: 104000 },
      { id: '5', date: '2021-02-28', amount: 105000 },
      { id: '6', date: '2021-03-31', amount: 106000 },
    ];

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

    const actual = createPeriodicNetWorth(allTransactions, 'month');

    expect(actual).toEqual(expected);
  });
});
