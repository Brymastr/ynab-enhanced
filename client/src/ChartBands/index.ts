import Chart from './types';
import { RED, GREEN, BLUE } from '../colors';

function calculateGradientFill(
  ctx: any,
  scale: any,
  height: any,
  baseColor: any,
  gradientColor: any,
) {
  const yPos = scale.getPixelForValue(false);
  const grd = ctx.createLinearGradient(0, height, 0, 0);
  const gradientStop = 1 - yPos / height;

  grd.addColorStop(0, gradientColor);
  grd.addColorStop(gradientStop, gradientColor);
  grd.addColorStop(gradientStop, baseColor);
  grd.addColorStop(1.0, baseColor);

  return grd;
}

const plugin = {
  id: 'BandsPlugin',
  afterScaleUpdate: (chartInstance: Chart) => {
    const canvas = chartInstance.ctx.canvas?.getContext('2d');
    const yAxis = chartInstance.scales['y-axis-0'];
    for (let i = 0; i < chartInstance.config.data.datasets.length; i++) {
      const fill = calculateGradientFill(canvas, yAxis, chartInstance.height, BLUE, [RED]);
      chartInstance.config.data.datasets[i]['borderColor'] = fill;
    }
  },
};

export default plugin;
