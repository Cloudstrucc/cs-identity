//
// user.js
// Use this to write your custom JS
//

import 'chartjs-adapter-luxon';
import './chart';

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

import { DateTime } from 'luxon';
import { getCSSVariableValue } from './helpers';
import Dropzone from 'dropzone';
import Tiptap from './tiptap';

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

// Generate random chart data

function generatePatternedValue(index, totalPoints, minValue, maxValue, totalWaves) {
  const pointsPerWave = totalPoints / totalWaves;

  // Set a constant amplitude
  const amplitude = (maxValue - minValue) / 2;
  const offset = (maxValue + minValue) / 2;

  // Calculate the wave phase, ensuring it loops correctly per wave
  const wavePhase = (index % pointsPerWave) / pointsPerWave;

  // Generate a sine wave pattern with constant amplitude
  const value = Math.sin(wavePhase * Math.PI * 2) * amplitude + offset;

  return Math.round(value * 10) / 10; // Round to 1 decimal place
}

function generateChartData(startDate, endDate, minValue, maxValue, limit, totalWaves = 4) {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);

  // Calculate the total number of days between the dates
  const totalDays = end.diff(start, 'days').days;

  // If limit is specified, use it; otherwise, use totalDays (ensuring at least 7 points)
  const totalPoints = limit || totalDays;

  // Generate the data
  const data = [];
  for (let i = 0; i <= totalPoints; i++) {
    // Calculate date for each point based on the total points
    const date = start.plus({ days: (i / totalPoints) * totalDays }).toISODate();
    const value = generatePatternedValue(i, totalPoints, minValue, maxValue, totalWaves);

    data.push({ x: date, y: value });
  }

  return data;
}

// User performance chart

const userPerformanceChart = document.getElementById('userPerformanceChart');

if (userPerformanceChart) {
  new Chart(userPerformanceChart, {
    type: 'bar',
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'EEE',
            },
            tooltipFormat: 'EEE',
          },
        },
        y: {
          ticks: {
            callback: (value) => `${value}hrs`,
            stepSize: 1,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.parsed.y}hrs`,
          },
        },
      },
    },
    data: {
      datasets: [
        {
          label: 'Total',
          data: generateChartData('2024-01-01', '2024-01-07', 5, 8),
        },
        {
          label: 'Tracked',
          data: generateChartData('2024-01-01', '2024-01-07', 5, 6),
          backgroundColor: getCSSVariableValue('--bs-dark'),
        },
      ],
    },
  });
}

// Project performance chart

const projectPerformanceChart = document.getElementById('projectPerformanceChart');

if (projectPerformanceChart) {
  new Chart(projectPerformanceChart, {
    type: 'line',
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM dd',
            },
            tooltipFormat: 'MMM dd',
          },
        },
        y: {
          ticks: {
            callback: (value) => `${value}hrs`,
            stepSize: 20,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y}hrs`,
          },
        },
      },
    },
    data: {
      datasets: [
        {
          label: 'Hours worked',
          data: generateChartData('2024-01-01', '2024-01-07', 50, 80),
        },
      ],
    },
  });
}

// Crypto performance chart

const cryptoPerformanceChart = document.getElementById('cryptoPerformanceChart');

if (cryptoPerformanceChart) {
  const chart = new Chart(cryptoPerformanceChart, {
    type: 'line',
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM dd',
            },
            tooltipFormat: 'MMM dd',
          },
        },
        y: {
          ticks: {
            callback: (value) => `$${Math.round(value / 1000)}K`,
            stepSize: 10000,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `$${new Intl.NumberFormat('en-EN').format(Math.round(context.parsed.y))}`,
          },
        },
      },
    },
    data: {
      datasets: [
        {
          label: 'Trading profits',
          data: generateChartData('2024-01-01', '2024-01-31', 25000, 35000),
        },
      ],
    },
  });

  const select = document.getElementById('cryptoPerformanceChartType');

  select.addEventListener('change', (e) => {
    const period = e.target.value;

    switch (period) {
      case 'trading': {
        chart.data.datasets.label = 'Trading profits';
        chart.data.datasets[0].data = generateChartData('2024-01-01', '2024-01-31', 25000, 35000);
        break;
      }
      case 'staking': {
        chart.data.datasets.label = 'Staking rewards';
        chart.data.datasets[0].data = generateChartData('2024-01-01', '2024-01-31', 25000, 35000, null, 3);
        break;
      }
      case 'mining': {
        chart.data.datasets.label = 'Mining income';
        chart.data.datasets[0].data = generateChartData('2024-01-01', '2024-01-31', 25000, 35000, null, 2);
        break;
      }
    }

    chart.update();
  });
}

// Crypto portfolio chart

const cryptoPortfolioChart = document.getElementById('cryptoPortfolioChart');

if (cryptoPortfolioChart) {
  new Chart(cryptoPortfolioChart, {
    type: 'doughnut',
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${context.raw}%`,
          },
        },
      },
    },
    data: {
      labels: ['Bitcoin', 'Ethereum', 'Tether', 'Dogecoin'],
      datasets: [
        {
          data: [65, 15, 10, 10],
          backgroundColor: [
            `rgba(${getCSSVariableValue('--bs-primary-rgb')}, 1)`,
            `rgba(${getCSSVariableValue('--bs-primary-rgb')}, .5)`,
            `rgba(${getCSSVariableValue('--bs-primary-rgb')}, .25)`,
            `rgba(${getCSSVariableValue('--bs-primary-rgb')}, .125)`,
          ],
        },
      ],
    },
  });
}

// Crypto currency charts

const cryptoCurrencySuccessCharts = document.querySelectorAll('[data-crypto-currency-success-chart]');

cryptoCurrencySuccessCharts.forEach((cryptoCurrencySuccessChart) => {
  new Chart(cryptoCurrencySuccessChart, {
    type: 'line',
    options: {
      scales: {
        y: {
          display: false,
          beginAtZero: false,
        },
        x: {
          display: false,
        },
      },
      elements: {
        point: {
          hoverRadius: 0,
        },
        line: {
          borderWidth: 1,
          borderColor: getCSSVariableValue('--bs-success'),
          backgroundColor: 'transparent',
        },
      },
      plugins: {
        tooltip: {
          external: () => false,
        },
      },
    },
    data: {
      datasets: [
        {
          label: 'Currency price',
          data: generateChartData('2024-01-01', '2024-01-07', 5000, 5500),
        },
      ],
    },
  });
});

const cryptoCurrencyDangerCharts = document.querySelectorAll('[data-crypto-currency-danger-chart]');

cryptoCurrencyDangerCharts.forEach((cryptoCurrencyDangerChart) => {
  new Chart(cryptoCurrencyDangerChart, {
    type: 'line',
    options: {
      scales: {
        y: {
          display: false,
          beginAtZero: false,
        },
        x: {
          display: false,
        },
      },
      elements: {
        point: {
          hoverRadius: 0,
        },
        line: {
          borderWidth: 1,
          borderColor: getCSSVariableValue('--bs-danger'),
          backgroundColor: 'transparent',
        },
      },
      plugins: {
        tooltip: {
          external: () => false,
        },
      },
    },
    data: {
      datasets: [
        {
          label: 'Currency price',
          data: generateChartData('2024-01-01', '2024-01-07', 5000, 5500),
        },
      ],
    },
  });
});

// SaaS performance chart

const saasPerformanceChart = document.getElementById('saasPerformanceChart');

if (saasPerformanceChart) {
  const chart = new Chart(saasPerformanceChart, {
    type: 'bar',
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM dd',
            },
            tooltipFormat: 'MMM dd',
          },
        },
        y: {
          ticks: {
            callback: (value) => `$${Math.round(value / 1000)}K`,
            stepSize: 10000,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `$${new Intl.NumberFormat('en-EN').format(Math.round(context.parsed.y))}`,
          },
        },
      },
    },
    data: {
      datasets: [
        {
          label: 'Revenue',
          data: generateChartData('2024-01-01', '2024-01-31', 25000, 35000, 15),
        },
      ],
    },
  });

  const tabs = document.querySelectorAll('[data-saas-performance-chart-type]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      const type = e.target.dataset.saasPerformanceChartType;

      switch (type) {
        case 'revenue': {
          chart.options.scales.y.ticks.callback = (value) => `$${Math.round(value / 1000)}K`;
          chart.options.scales.y.ticks.stepSize = 10000;
          chart.options.plugins.tooltip.callbacks.label = (context) => `$${new Intl.NumberFormat('en-EN').format(Math.round(context.parsed.y))}`;
          chart.data.datasets.label = 'Revenue';
          chart.data.datasets[0].data = generateChartData('2024-01-01', '2024-01-31', 25000, 35000, 15);
          break;
        }
        case 'users': {
          chart.options.scales.y.ticks.callback = (value) => `${value} usrs`;
          chart.options.scales.y.ticks.stepSize = 100;
          chart.options.plugins.tooltip.callbacks.label = (context) => `${context.parsed.y} usrs`;
          chart.data.datasets.label = 'Active users';
          chart.data.datasets[0].data = generateChartData('2024-01-01', '2024-01-31', 250, 350, 15, 3);
          break;
        }
        case 'churn': {
          chart.options.scales.y.ticks.callback = (value) => `${value}%`;
          chart.options.scales.y.ticks.stepSize = 2;
          chart.options.plugins.tooltip.callbacks.label = (context) => `${context.parsed.y}%`;
          chart.data.datasets.label = 'Churn rate';
          chart.data.datasets[0].data = generateChartData('2024-01-01', '2024-01-31', 2, 10, 15, 2);
          break;
        }
      }

      chart.update();
    });
  });
}

// Post

const post = document.getElementById('post');

if (post) {
  new Tiptap({
    element: post,
    content: `
      <p>In today's fast-evolving digital landscape, keeping up with modern web development practices is no longer optional—it's a <em>necessity</em>. Whether you're a seasoned developer or just starting, embracing these practices can greatly enhance your workflow, improve your application's performance, and offer a more seamless user experience.</p>
      <p>The introduction of tools like <code>webpack</code>, advanced CSS frameworks, and JavaScript libraries has revolutionized how we approach development. Streamlining repetitive tasks, automating deployments, and enhancing the design through responsive techniques have all become critical components of a modern workflow.</p>
      <blockquote>
        <p>"The best way to predict the future is to create it." — Peter Drucker</p>
      </blockquote>
      <p>This idea rings especially true in the world of web development. By adopting newer technologies and methodologies, developers have the power to shape the digital experience.</p>
      <h2>The Role of Automation in Development</h2>
      <p>Automation has become a cornerstone of modern web development, with tools such as GitHub Actions, continuous integration, and task runners like <code>Gulp</code>. These tools allow developers to spend more time coding and less time dealing with tedious setup or deployment tasks.</p>
      <p>For example, automating the process of minifying CSS and JavaScript files can lead to faster load times, ultimately improving the overall user experience. This also reduces the potential for human error, ensuring a more consistent and reliable final product.</p>
      <h2>Writing Maintainable Code for the Future</h2>
      <p>Writing maintainable code is crucial for long-term success in web development. As projects grow in size and complexity, clear, well-organized code can save countless hours of debugging and future modifications. Following best practices, such as adhering to naming conventions, breaking down large components into smaller, reusable parts, and properly documenting code, can ensure that your codebase remains easy to manage and scale over time.</p>
      <p>Key principles for writing maintainable code include:</p>
      <ul>
        <li>Following consistent naming conventions</li><li>Breaking down complex logic into smaller functions or components</li>
        <li>Writing clear, concise documentation for future reference</li>
        <li>Using version control effectively to track changes and collaborate with others</li>
      </ul>
      <p>By adhering to these principles, you set the foundation for a cleaner and more scalable project.</p>
`,
    autofocus: 'end',
  });
}

// Tiptap example

const editor = document.getElementById('tiptapExample');

if (editor) {
  new Tiptap({ element: editor });
}

// Dropzone example

const dropzone = document.getElementById('dropzone');

if (dropzone) {
  new Dropzone(dropzone, { url: '/' });
}
