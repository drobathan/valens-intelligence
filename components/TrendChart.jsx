'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useRef } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

function formatLabel(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export default function TrendChart({ history = [] }) {
  const chartRef = useRef(null);

  const labels = history.map((h) => formatLabel(h.date));
  const scores = history.map((h) => h.score);
  const threshold = history.map(() => 75);

  // Build gradient on canvas mount
  function getGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(198,167,94,0.20)');
    gradient.addColorStop(1, 'rgba(198,167,94,0.00)');
    return gradient;
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'GSI Score',
        data: scores,
        borderColor: '#C6A75E',
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx } = chart;
          return getGradient(canvasCtx);
        },
        borderWidth: 2,
        pointBackgroundColor: '#C6A75E',
        pointBorderColor: '#0B1C2D',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Stability Threshold',
        data: threshold,
        borderColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(11,28,45,0.97)',
        borderColor: 'rgba(198,167,94,0.30)',
        borderWidth: 1,
        titleColor: 'rgba(255,255,255,0.55)',
        bodyColor: '#FFFFFF',
        titleFont: { family: 'Inter', size: 11, weight: '500' },
        bodyFont: { family: 'Playfair Display', size: 18 },
        padding: 14,
        callbacks: {
          label: (ctx) =>
            ctx.datasetIndex === 0 ? `GSI  ${ctx.raw}` : null,
          afterLabel: (ctx) =>
            ctx.datasetIndex === 0 && ctx.raw >= 75 ? '↑ Stable band' : null,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: { color: 'rgba(255,255,255,0.40)', font: { family: 'Inter', size: 11 } },
        border: { display: false },
      },
      y: {
        min: 50,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: { color: 'rgba(255,255,255,0.40)', font: { family: 'Inter', size: 11 }, stepSize: 10 },
        border: { display: false },
      },
    },
  };

  return (
    <div style={{ position: 'relative', height: 240 }}>
      <Line ref={chartRef} data={data} options={options}/>
    </div>
  );
}
