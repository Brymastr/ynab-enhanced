import { BLUE } from '../colors';
import { ChartOptions, ChartData, ChartDataset, TooltipItem, ChartTypeRegistry } from 'chart.js';
import { formatCurrency, formatEndOfMonth } from '../services/helper';
import { subMonths, addMonths } from 'date-fns';
import { WorthDate } from '@/composables/types';

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
  const date = subMonths(new Date(), seriesLength);

  const dates: string[] = [];

  for (let i = 0; i <= seriesLength; i++) {
    const d = formatEndOfMonth(addMonths(date, i).toISOString());
    dates.push(d);
  }

  return dates;
}

export function getOptions(onClick?: () => void) {
  const options: ChartOptions = {
    layout: {
      padding: 35,
    },
    animation: {
      easing: 'easeInOutQuad',
      duration: 400,
    },
    responsive: true,
    maintainAspectRatio: false,
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
      y: {
        beginAtZero: false,
        position: 'right',
        ticks: {
          display: true,
          mirror: true,
          labelOffset: -10,
          padding: -4,
          maxTicksLimit: 6,
          z: 100,
          callback: tickValue => formatCurrency(tickValue),
        },
        grid: {
          drawBorder: false,
          display: true,
          lineWidth: 0.5,
        },
      },
      x: {
        ticks: {
          display: true,
          maxTicksLimit: 5,
        },
        grid: {
          display: false,
        },
      },
    },
    onClick,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        intersect: false,
        mode: 'index',
        displayColors: false,
        caretPadding: 7,
        padding: 10,
        callbacks: {
          label(tooltipItem: TooltipItem<keyof ChartTypeRegistry>): string | string[] {
            const { dataIndex, dataset } = tooltipItem;
            let currentNum = 0;
            let currentStr = '';
            let previousNum = 0;
            let previousStr = 'Change: -';
            const list = dataset.data as number[];
            currentNum = list[dataIndex];
            if (dataIndex > 0) previousNum = list[dataIndex - 1];
            currentStr = `Current: ${formatCurrency(currentNum)}`;
            if (dataIndex > 0) previousStr = `Change: ${formatCurrency(currentNum - previousNum)}`;
            else previousStr = `Change: -`;
            return [currentStr, previousStr];
          },
        },
      },
      // crosshair: {
      //   line: {
      //     color: GREY,
      //     width: 0.5,
      //   },
      //   zoom: { enabled: false },
      //   snap: { enabled: true },
      //   sync: { enabled: true },
      // },
    },
  };

  return options;
}

export function getChartData(values: WorthDate[]) {
  const data = values.map(({ worth }) => worth);
  const labels = values.map(({ date }) => date);
  const datasets: ChartDataset[] = [
    {
      label: 'Monthly Net Worth',
      data,
      backgroundColor: 'rgb(98, 179, 254, 0.2)',
      pointBackgroundColor: '#3281CE',
      pointRadius: 3,
      pointHoverRadius: 7,
      fill: 'origin',
      tension: 0.4,
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

    if (i !== 0) x.previous = result[i - 1];

    result.push(x);
  }

  return result;
}
