import { useState } from "react";
import axios from "axios";

function App() {
  const [goal, setGoal] = useState("");
  const [subjects, setSubjects] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [planData, setPlanData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const subjectArray = subjects.split(",").map((s) => s.trim());

      const res = await axios.post("http://localhost:5000/generate-plan", {
        goal,
        subjects: subjectArray,
        hoursPerDay,
        targetDate,
      });

      if (res.data.error) {
        setError(res.data.error);
        setPlanData(null);
      } else {
        setPlanData(res.data);
      }
    } catch (err) {
      setError("Server error: Unable to generate plan.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        StudyGenie 📚 – AI Study Planner
      </h1>

      {/* 🔘 Form Section */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <div>
          <label className="block font-semibold">🎯 Goal</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., GATE, IELTS"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">📘 Subjects (comma separated)</label>
          <input
            type="text"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            placeholder="e.g., OS, CN, DS"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">⏳ Hours per Day</label>
          <input
            type="number"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
            placeholder="e.g., 3"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">📅 Target Exam Date</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          Generate Study Plan
        </button>
      </form>

      {/* ⚠️ Error */}
      {error && (
        <div className="max-w-2xl mx-auto mt-4 text-red-600 font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* 📄 Plan Table */}
      {planData && (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4 text-green-700">
            ✅ Study Plan for {planData.goal}
          </h2>
          <table className="w-full text-sm border border-gray-300 rounded">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">📅 Date</th>
                <th className="p-2 border">📘 Subject</th>
                <th className="p-2 border">📝 Topic</th>
                <th className="p-2 border">⏱️ Hours</th>
                <th className="p-2 border">✅ Status</th>
              </tr>
            </thead>
            <tbody>
              {planData.plan.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">{item.date}</td>
                  <td className="p-2 border">{item.subject}</td>
                  <td className="p-2 border">{item.topic}</td>
                  <td className="p-2 border text-center">{item.hours}</td>
                  <td className="p-2 border">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
