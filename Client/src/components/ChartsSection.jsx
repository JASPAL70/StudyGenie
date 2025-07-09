// src/components/ChartsSection.jsx
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function ChartsSection({ visualization }) {
  if (!visualization || !visualization.subject_hours) {
    return (
      <div className="text-center text-gray-500 mt-4">
        📉 No visualization data available
      </div>
    );
  }

  const subjects = visualization.subject_hours.map((s) => s.subject);
  const hours = visualization.subject_hours.map((s) => s.hours);

  const barData = {
    labels: subjects,
    datasets: [
      {
        label: "Total Hours Planned",
        data: hours,
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} hrs`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hours",
        },
      },
    },
  };

  const pieData = {
    labels: subjects,
    datasets: [
      {
        label: "Hours Distribution",
        data: hours,
        backgroundColor: [
          "#3B82F6",
          "#F59E0B",
          "#10B981",
          "#EF4444",
          "#8B5CF6",
          "#EC4899",
          "#F43F5E",
          "#6366F1",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="mt-10 space-y-10">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-4">
        📊 Study Time Distribution
      </h2>

      {/* Bar Chart */}
      <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow" style={{ height: "300px" }}>
        <Bar data={barData} options={barOptions} />
      </div>

      {/* Pie Chart */}
      <div className="max-w-md mx-auto bg-white p-4 rounded shadow" style={{ height: "300px" }}>
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>
  );
}

// // ChartsSection.jsx
// import React from "react";
// import { Bar, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// export default function ChartsSection({ visualization }) {
//   if (!visualization || !visualization.subject_hours) {
//     return <div className="text-center text-gray-500 mt-4">📉 No visualization data available</div>;
//   }

//   const subjects = visualization.subject_hours.map((s) => s.subject);
//   const hours = visualization.subject_hours.map((s) => s.hours);

//   const chartData = {
//     labels: subjects,
//     datasets: [
//       {
//         label: "Total Hours Planned",
//         data: hours,
//         backgroundColor: "#3B82F6",
//       },
//     ],
//   };

//   const pieData = {
//     labels: subjects,
//     datasets: [
//       {
//         label: "Study Hours Share",
//         data: hours,
//         backgroundColor: [
//           "#3B82F6",
//           "#10B981",
//           "#F59E0B",
//           "#EF4444",
//           "#8B5CF6",
//           "#EC4899",
//           "#6366F1",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//     },
//   };

//   return (
//     <div className="mt-10">
//       <h2 className="text-xl font-bold text-center text-blue-700 mb-4">
//         📊 Study Time Distribution
//       </h2>

//       {/* Bar Chart */}
//       <div className="max-w-xl mx-auto bg-white p-4 rounded shadow mb-8">
//         <Bar data={chartData} options={options} />
//       </div>

//       {/* Pie Chart */}
//       <h2 className="text-xl font-bold text-center text-purple-700 mb-4">
//         🥧 Subject-wise Share of Study Time
//       </h2>
//       <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
//         <Pie data={pieData} />
//       </div>
//     </div>
//   );
// }
