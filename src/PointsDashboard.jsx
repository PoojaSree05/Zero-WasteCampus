import { useState, useEffect } from "react";
import axios from "axios";

function PointsDashboard() {
  const [students, setStudents] = useState([]);

useEffect(() => {
    axios.get("http://localhost:5000/students").then(res => {
      // Sort students by points descending
      const sorted = res.data.sort((a, b) => b.points - a.points);
      setStudents(sorted);
    });
  }, []);
return (
    <div className="text-center p-4">
      <h2 className="text-primary text-2xl font-bold mb-4">🏆Gamification</h2>
      
      <table className="mx-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border px-4 py-2">Rank</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Roll No</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => (
            <tr key={s.rollno} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{s.name}</td>
              <td className="border px-4 py-2">{s.rollno}</td>
              <td className="border px-4 py-2">{s.department}</td>
              <td className="border px-4 py-2">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default PointsDashboard; 