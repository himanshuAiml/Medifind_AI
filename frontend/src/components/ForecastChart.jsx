import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler
);

const options = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { color: "rgba(196, 193, 181, 0.4)" },
      ticks: { color: "#5e6358", font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(196, 193, 181, 0.4)" },
      ticks: { color: "#5e6358", font: { size: 11 } },
    },
  },
};

export default function ForecastChart({ forecast }) {
  const dailyData = {
    labels: forecast.daily.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: "Units per day",
        data: forecast.daily.map((d) => Math.round(d.units)),
        borderColor: "#3a4d35",
        backgroundColor: "rgba(58, 77, 53, 0.16)",
        fill: true,
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  const weeklyData = {
    labels: forecast.weekly.map((w) => w.week_start),
    datasets: [
      {
        label: "Units per week",
        data: forecast.weekly.map((w) => Math.round(w.units)),
        backgroundColor: "#3a4d35",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#cfccc2] bg-[#eae7de] p-4 shadow-xs">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5e6358]">
          Expected daily demand
        </h3>
        <Line data={dailyData} options={options} />
      </div>
      <div className="rounded-xl border border-[#cfccc2] bg-[#eae7de] p-4 shadow-xs">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5e6358]">
          Expected weekly demand
        </h3>
        <Bar data={weeklyData} options={options} />
      </div>
    </div>
  );
}