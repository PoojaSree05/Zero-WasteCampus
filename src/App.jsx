import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import SmartBin from "./SmartBin";
import WasteClassifier from "./WasteClassifier";
import DashBoard from "./DashBoard";
import PointsDashboard from "./PointsDashboard";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [bins, setBins] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const binRes = await axios.get("http://localhost:5000/bins");
        setBins(binRes.data);

        const studentRes = await axios.get("http://localhost:5000/students");
        setStudents(studentRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <Router>
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-dark bg-success rounded shadow mb-4">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold" to="/">Zero-Waste Campus</Link>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/Smartbin">Smart Bin</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/WasteClassifier">AI Classifier</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/DashBoard">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/PointsDashboard">Leaderboard</Link></li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Smartbin" element={<SmartBin />} />
          <Route path="/WasteClassifier" element={
            <WasteClassifier
              bins={bins}
              setBins={setBins}
              students={students}
              setStudents={setStudents}
            />
          } />
          <Route path="/DashBoard" element={<DashBoard bins={bins} />} />
          <Route path="/PointsDashboard" element={<PointsDashboard students={students} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
