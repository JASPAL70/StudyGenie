import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import ChartsSection from "./components/ChartsSection"; // ✅ Make sure this path exists

const GOALS = ["GATE", "IELTS", "UPSC"];

export default function App() {
  const [goal, setGoal] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [plan, setPlan] = useState([]);
  const [error, setError] = useState("");
  const [planMode, setPlanMode] = useState("hours");
  const [visualization, setVisualization] = useState(null); // ✅ Chart data

  const copyToClipboard = () => {
    const tableText = plan
      .map(
        (item, i) =>
          `${i + 1}. ${item.date} - ` +
          item.subjects.map((s) => `${s.name} (${s.hours}h)`).join(", ") +
          ` - ${item.status}`
      )
      .join("\n");

    navigator.clipboard.writeText(tableText);
    alert("✅ Study plan copied to clipboard!");
  };

  const downloadCSV = () => {
    const csv = [
      "S.No,Date,Subjects,Status",
      ...plan.map(
        (item, i) =>
          `${i + 1},${item.date},"${item.subjects
            .map((s) => `${s.name} (${s.hours}h)`)
            .join(" / ")}",${item.status}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "StudyGenie_Subject_Plan.csv");
  };

  useEffect(() => {
    setPlan([]);
  }, []);

  const addSubject = () => {
    if (subjectInput.trim() && !subjects.includes(subjectInput.trim())) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput("");
    }
  };

  const removeSubject = (subj) => {
    setSubjects(subjects.filter((s) => s !== subj));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/generate-plan", {
        goal,
        subjects,
        hoursPerDay: Number(hoursPerDay),
        targetDate,
        planMode,
      });

      if (res.data.error) {
        setError(res.data.error);
        setPlan([]);
      } else {
        setPlan(res.data.plan || []);
        setVisualization(res.data.visualization || null); // ✅ Set chart data
      }
    } catch (err) {
      setError("🚫 Server error: " + err.message);
    }
  };

  const updateStatus = (index, status) => {
    const updated = [...plan];
    updated[index].status = status;
    setPlan(updated);
    localStorage.setItem("studyPlan", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
          🎓 StudyGenie – Subject Planner
        </h1>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-semibold">🎯 Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Goal</option>
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">🕒 Hours/Day</label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">📅 Target Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">🛠️ Plan Mode</label>
              <div className="flex gap-4 mt-1">
                <label>
                  <input
                    type="radio"
                    value="hours"
                    checked={planMode === "hours"}
                    onChange={() => setPlanMode("hours")}
                    className="mr-1"
                  />
                  Hours-wise
                </label>
                <label>
                  <input
                    type="radio"
                    value="day"
                    checked={planMode === "day"}
                    onChange={() => setPlanMode("day")}
                    className="mr-1"
                  />
                  Day-wise
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold">📘 Add Subject</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder="Enter subject"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addSubject}
                  className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
                >
                  ➕ Add
                </button>
              </div>
              <div className="mt-2 space-x-2">
                {subjects.map((s) => (
                  <span
                    key={s}
                    className="inline-block bg-blue-200 px-2 py-1 rounded-full text-sm"
                  >
                    {s}
                    <button
                      onClick={() => removeSubject(s)}
                      className="ml-1 text-red-500"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700"
          >
            📅 Generate Plan
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="text-red-600 font-semibold mt-4 text-center">
            {error}
          </div>
        )}

        {/* Plan Table & Chart */}
        {plan.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
              📚 Your Subject Plan
            </h2>

            <div className="mb-4 flex justify-end gap-4">
              <button
                onClick={copyToClipboard}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
              >
                📋 Copy
              </button>
              <button
                onClick={downloadCSV}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
              >
                ⬇️ Download CSV
              </button>
            </div>

            <div className="overflow-x-auto max-h-[400px] rounded border">
              <table className="w-full text-sm text-left">
                <thead className="bg-blue-100 sticky top-0">
                  <tr>
                    <th className="p-3 border">#</th>
                    <th className="p-3 border">📅 Date</th>
                    <th className="p-3 border">📘 Subject</th>
                    <th className="p-3 border">📌 Status</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {plan.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="p-2 border text-center">{index + 1}</td>
                      <td className="p-2 border">{item.date}</td>
                      <td className="p-2 border">
                        {item.subjects?.map((s, idx) => (
                          <div key={idx}>
                            {s.name} - {s.hours}h
                          </div>
                        ))}
                      </td>
                      <td className="p-2 border">{item.status}</td>
                      <td className="p-2 border space-x-2">
                        <button
                          onClick={() => updateStatus(index, "Done")}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs"
                        >
                          ✅ Done
                        </button>
                        <button
                          onClick={() => updateStatus(index, "Skipped")}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-xs"
                        >
                          ❌ Skip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Charts Section */}
            {plan.length > 0 && visualization && visualization.subject_hours && (
  <ChartsSection visualization={visualization} />
)}
          </div>
        )}
      </div>
    </div>
  );
}

