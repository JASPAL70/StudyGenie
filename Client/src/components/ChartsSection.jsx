// ChartsSection.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ChartsSection({ visualization }) {
  if (!visualization || !visualization.subject_hours) {
    return <div className="text-center text-gray-500 mt-4">📉 No visualization data available</div>;
  }

  const subjects = visualization.subject_hours.map((s) => s.subject);
  const hours = visualization.subject_hours.map((s) => s.hours);

  const chartData = {
    labels: subjects,
    datasets: [
      {
        label: "Total Hours Planned",
        data: hours,
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-4">
        📊 Study Time Distribution
      </h2>
      <div className="max-w-xl mx-auto bg-white p-4 rounded shadow">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
