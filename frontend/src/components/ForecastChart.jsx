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
  scales: { y: { beginAtZero: true } },
};

export default function ForecastChart({ forecast }) {
  const dailyData = {
    labels: forecast.daily.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: "Units per day",
        data: forecast.daily.map((d) => Math.round(d.units)),
        borderColor: "#0d9488",
        backgroundColor: "rgba(13,148,136,0.15)",
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
        backgroundColor: "#0d9488",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Expected daily demand</h3>
        <Line data={dailyData} options={options} />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Expected weekly demand</h3>
        <Bar data={weeklyData} options={options} />
      </div>
    </div>
  );
}