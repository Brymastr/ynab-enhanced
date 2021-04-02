export interface ChartBandOptions {
  yValue: boolean;
  bandLine: {
    stroke?: number;
    colour?: string;
    type?: string;
    label?: string;
    fontSize?: string;
    fontFamily?: string;
    fontStyle?: string;
    xPos?: string;
    yPos?: string;
  };
  belowThresholdColour: string[];
}

declare class Chart {
  ctx: CanvasRenderingContext2D;
  scales: {
    'x-axis-0': ChartElement;
    'y-axis-0': ChartElement;
  };
  chartArea: ChartArea;
  height: number;
  config: ChartConfig;
}

export interface ChartElement {
  _startPixel: number;
  _endPixel: number;
}

export interface ChartArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartConfig {
  data: {
    datasets: any[];
  };
}

export default Chart;
