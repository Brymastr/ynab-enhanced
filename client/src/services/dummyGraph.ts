import { BLUE, GREY } from '../colors';
import { ChartOptions, ChartData, ChartDataSets, ChartTooltipItem } from 'chart.js';
import { formatCurrency, formatDate } from '../services/helper';
import moment from 'moment';
import { WorthDate } from '@/store/modules/ynab/types';

function randomNumber(minLength = 8, maxLength = 50) {
  return ~~(Math.random() * (maxLength - minLength + 1) + minLength);
}

function getRandomDataset(seriesLength: number) {
  const dataset: number[] = [];
  const modifier = randomNumber(1, 10);

  const probability = [-1933, -554, 190, 534, 674, 722, 930, 1687, 2329, 3542].map(
    x => x * modifier,
  );
  let currentValue = randomNumber(-50000, 100000);

  for (let i = 0; i < seriesLength; i++) {
    const random = randomNumber(1, 10);

    currentValue += probability[random - 1];

    dataset.push(currentValue);
  }

  return dataset;
}

function getDateRange(seriesLength: number) {
  const date = moment().subtract(seriesLength, 'months');

  const dates = [];

  for (let i = 0; i <= seriesLength; i++) {
    const d = formatDate(date.clone());
    dates.push(d);
    date.add(1, 'month');
  }

  return dates;
}

export function getOptions(clickFunc?: () => void) {
  const options: ChartOptions = {
    layout: {
      padding: 35,
    },
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      enabled: true,
      intersect: false,
      mode: 'index',
      displayColors: false,
      caretPadding: 7,
      xPadding: 10,
      yPadding: 10,
      callbacks: {
        label: (tooltipItem: ChartTooltipItem, data: ChartData): string | string[] => {
          const { index, value } = tooltipItem;

          if (index === undefined || !value || !data.datasets || !data.datasets[0].data) return [];

          let currentNum = 0;
          let currentStr = '';
          let previousNum = 0;
          let previousStr = 'Change: -';

          const list = data.datasets[0].data as number[];

          currentNum = list[index];
          if (index > 0) previousNum = list[index - 1];

          currentStr = `Current: ${formatCurrency(currentNum)}`;
          if (index > 0) previousStr = `Change: ${formatCurrency(currentNum - previousNum)}`;
          else previousStr = `Change: -`;

          return [currentStr, previousStr];
        },
      },
    },
    events: ['mousemove', 'click'],
    hover: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      point: {
        pointStyle: 'circle',
        borderWidth: 0,
        backgroundColor: BLUE,
      },
    },
    scales: {
      yAxes: [
        {
          position: 'right',
          ticks: {
            maxTicksLimit: 5,
            display: true,
            beginAtZero: false,
            callback: formatCurrency,
            fontFamily: 'monospace',
          },
          gridLines: {
            drawBorder: false,
            display: true,
            zeroLineWidth: 0.5,
            lineWidth: 0.3,
          },
        },
      ],
      xAxes: [
        {
          type: 'time',
          ticks: {
            display: true,
            autoSkip: true,
            maxTicksLimit: 8,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    plugins: {
      crosshair: {
        line: {
          color: GREY,
          width: 0.5,
        },
        zoom: { enabled: false },
        snap: { enabled: true },
        sync: { enabled: true },
      },
    },
  };

  if (clickFunc) options.onClick = clickFunc;
  options.onHover = (event: MouseEvent, activeElements: Element[]) => {
    // @ts-ignore
    event.target.style.cursor = activeElements[0] ? 'pointer' : 'default';
  };

  return options;
}

export function getChartData(values: WorthDate[]) {
  const data = values.map(x => x.worth);
  const labels = values.map(x => x.date);

  const datasets: ChartDataSets[] = [
    {
      label: 'Monthly Net Worth',
      data,
      fill: true,
      pointBackgroundColor: '#3281CE',
      backgroundColor: 'rgb(98, 179, 254, 0.2)',
      pointRadius: 3,
      pointHoverRadius: 7,
    },
  ];

  const chartData: ChartData = { labels, datasets };

  return chartData;
}

export function getData() {
  const seriesLength = randomNumber();

  const dates = getDateRange(seriesLength);
  const values: number[] = getRandomDataset(seriesLength);

  const result: WorthDate[] = [];

  for (let i = 0; i < seriesLength; i++) {
    const x: WorthDate = {
      date: dates[i],
      worth: values[i],
    };

    result.push(x);
  }

  return result;
}
