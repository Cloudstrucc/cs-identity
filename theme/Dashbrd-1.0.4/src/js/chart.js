//
// chart.js
//

import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart,
  Decimation,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  LogarithmicScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
} from 'chart.js';

import { getCSSVariableValue, getGradient } from './helpers';

Chart.register(
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Decimation,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip
);

export const colors = {
  bodySecondary: getCSSVariableValue('--bs-secondary-color'),
  bodyBg: getCSSVariableValue('--bs-body-bg'),
  border: getCSSVariableValue('--bs-border-color'),
  primary: getCSSVariableValue('--bs-primary'),
  primaryTranslucent: `rgba(${getCSSVariableValue('--bs-primary-rgb')}, .05)`,
  transparent: 'rgba(255, 255, 255, 0)',
};

const fonts = {
  base: 'Inter',
};

//
// Functions
//

function globalOptions() {
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;

  // Default
  Chart.defaults.color = colors.bodySecondary;
  Chart.defaults.font.family = fonts.base;
  Chart.defaults.font.size = 13;

  // Layout
  Chart.defaults.layout.padding = 0;

  // Legend
  Chart.defaults.plugins.legend.display = false;

  // Point
  Chart.defaults.elements.point.radius = 0;
  Chart.defaults.elements.point.backgroundColor = colors.primary;

  // Line
  Chart.defaults.elements.line.tension = 0.4;
  Chart.defaults.elements.line.borderWidth = 2;
  Chart.defaults.elements.line.borderColor = colors.primary;
  Chart.defaults.elements.line.backgroundColor = (context) => {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) {
      return;
    }
    return getGradient(ctx, chartArea, [colors.transparent, colors.primaryTranslucent, colors.primaryTranslucent]);
  };
  Chart.defaults.elements.line.borderCapStyle = 'rounded';
  Chart.defaults.elements.line.fill = true;

  // Bar
  Chart.defaults.elements.bar.backgroundColor = colors.primary;
  Chart.defaults.elements.bar.borderWidth = 0;
  Chart.defaults.elements.bar.borderRadius = 6;
  Chart.defaults.elements.bar.borderSkipped = false;
  Chart.defaults.datasets.bar.maxBarThickness = 12;

  // Arc
  Chart.defaults.elements.arc.backgroundColor = colors.primary;
  Chart.defaults.elements.arc.borderWidth = 4;
  Chart.defaults.elements.arc.borderColor = colors.bodyBg;
  Chart.defaults.elements.arc.hoverBorderColor = colors.bodyBg;

  // Tooltips
  Chart.defaults.plugins.tooltip.enabled = false;
  Chart.defaults.plugins.tooltip.mode = 'index';
  Chart.defaults.plugins.tooltip.intersect = false;
  Chart.defaults.plugins.tooltip.external = externalTooltipHandler;

  // Doughnut
  Chart.defaults.datasets.doughnut.cutout = '83%';

  // yAxis
  Chart.defaults.scales.linear.border = { ...Chart.defaults.scales.linear.border, ...{ display: false, dash: [3], dashOffset: [2] } };
  Chart.defaults.scales.linear.grid = {
    ...Chart.defaults.scales.linear.grid,
    ...{ color: colors.border, drawTicks: false },
  };

  Chart.defaults.scales.linear.beginAtZero = true;
  Chart.defaults.scales.linear.ticks.padding = 10;
  Chart.defaults.scales.linear.ticks.stepSize = 10;

  // xAxis
  Chart.defaults.scales.category.border = { ...Chart.defaults.scales.category.border, ...{ display: false } };
  Chart.defaults.scales.category.grid = { ...Chart.defaults.scales.category.grid, ...{ display: false, drawTicks: false, drawOnChartArea: false } };
  Chart.defaults.scales.category.ticks.padding = 20;
  Chart.defaults.scales.category.ticks.autoSkip = true;
  Chart.defaults.scales.category.ticks.maxRotation = 0;
  Chart.defaults.scales.category.ticks.minRotation = 0;

  // Time axis
  Chart.defaults.scales.time.border = { ...Chart.defaults.scales.category.border, ...{ display: false } };
  Chart.defaults.scales.time.grid = { ...Chart.defaults.scales.category.grid, ...{ display: false, drawTicks: false, drawOnChartArea: false } };
  Chart.defaults.scales.time.ticks.padding = 20;
  Chart.defaults.scales.time.ticks.autoSkip = true;
  Chart.defaults.scales.time.ticks.maxRotation = 0;
  Chart.defaults.scales.time.ticks.minRotation = 0;
}

function getOrCreateTooltip(chart) {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.setAttribute('id', 'chart-tooltip');
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.classList.add('popover', 'bs-popover-top');

    const arrowEl = document.createElement('div');
    arrowEl.classList.add('popover-arrow', 'translate-middle-x');

    const contentEl = document.createElement('div');
    contentEl.classList.add('popover-content');

    tooltipEl.appendChild(arrowEl);
    tooltipEl.appendChild(contentEl);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
}

function externalTooltipHandler(context) {
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.visibility = 'hidden';
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((bodyItem) => bodyItem.lines);

    const headEl = document.createElement('h3');
    headEl.classList.add('popover-header');
    titleLines.forEach((title) => {
      const headingEl = document.createElement('span');
      headingEl.classList.add('d-block', 'text-center', 'text-nowrap');
      headingEl.innerText = title;
      headEl.appendChild(headingEl);
    });

    const bodyEl = document.createElement('div');
    bodyEl.classList.add('popover-body', 'd-flex', 'flex-column', 'gap-1');
    bodyLines.forEach((body, i) => {
      const colors = tooltip.labelColors[i];
      const color = chart.config.type === 'line' && colors.borderColor !== 'rgba(0,0,0,0.1)' ? colors.borderColor : colors.backgroundColor;

      const indicatorEl = document.createElement('span');
      indicatorEl.classList.add('material-symbols-outlined', 'me-1');
      indicatorEl.style.color = color;
      indicatorEl.innerText = 'circle';

      const labelEl = document.createElement('span');
      labelEl.innerText = body;

      const contentEl = document.createElement('div');
      contentEl.classList.add('d-flex', 'text-nowrap');
      contentEl.classList.add(bodyLines.length > 1 ? 'justify-content-left' : 'justify-content-center');
      contentEl.appendChild(indicatorEl);
      contentEl.appendChild(labelEl);

      bodyEl.appendChild(contentEl);
    });

    const rootEl = tooltipEl.querySelector('.popover-content');

    // Remove old children
    while (rootEl.firstChild) {
      rootEl.firstChild.remove();
    }

    // Add new children
    rootEl.appendChild(headEl);
    rootEl.appendChild(bodyEl);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.visibility = 'visible';
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.transform = 'translateX(-50%) translateY(-100%) translateY(-1rem)';
}

//
// Events
//

globalOptions();

// Make available globally for users of the /dist folder
// Feel free to comment this out if you're working in the /src folder
window.Chart = Chart;
