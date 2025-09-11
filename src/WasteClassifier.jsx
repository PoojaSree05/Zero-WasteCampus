import { useState, useEffect } from "react";
import axios from "axios";

function WasteClassifier() {
  const [image, setImage] = useState(null);
  const [wasteType, setWasteType] = useState("");
  const [studentName, setStudentName] = useState("");
  const [students, setStudents] = useState([]);
  const [bins, setBins] = useState([]);
  const [message, setMessage] = useState("");

  // Nearby bin suggestions
  const suggestionsMap = {
    "Food Waste": ["C Block", "Girls Hostel", "Near Book Depot"],
    "Plastic Waste": ["B Block", "Near Book Depot", "In DJB"],
    "Paper Waste": ["Near Boys Hostel", "Near Book Depot", "C Block"]
  };

  // Fetch students & bins
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await axios.get("http://localhost:5000/students");
        setStudents(studentRes.data);

        let binRes = await axios.get("http://localhost:5000/bins");
        // If bins don't exist, create default three bins
        if (!binRes.data.length) {
          const initialBins = [
            { id: 1, wasteType: "Food Waste", capacity: 100, currentFill: 20 },
            { id: 2, wasteType: "Plastic Waste", capacity: 100, currentFill: 25 },
            { id: 3, wasteType: "Paper Waste", capacity: 100, currentFill: 15 }
          ];
          for (let b of initialBins) {
            await axios.post("http://localhost:5000/bins", b);
          }
          binRes = await axios.get("http://localhost:5000/bins");
        }
        setBins(binRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Fake AI detection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));

    const fname = file.name.toLowerCase();
    let detectedType = "";
    if (fname.includes("apple") || fname.includes("banana") || fname.includes("food")) {
      detectedType = "Food Waste";
    } else if (fname.includes("plasticbottle") || fname.includes("plastic") || fname.includes("cover")) {
      detectedType = "Plastic Waste";
    } else if (fname.includes("paper") || fname.includes("book") || fname.includes("notebook")) {
      detectedType = "Paper Waste";
    }
    setWasteType(detectedType);
    setMessage(detectedType ? `Detected ${detectedType}. Bin opened.` : "Could not detect waste. Select manually.");
  };

  const handleDispose = async () => {
    if (!studentName) {
      setMessage("Please enter student ID or name.");
      return;
    }

    const student = students.find(
      (s) => s.name === studentName || s.rollno === studentName
    );
    if (!student) {
      setMessage("Student not found.");
      return;
    }

    const bin = bins.find((b) => b.wasteType === wasteType);
    if (!bin) {
      setMessage("No bin available for this waste type.");
      return;
    }

    // Check if bin >= 90%
    if (bin.currentFill >= 90) {
      setMessage(`Bin is almost full! Try another bin: ${suggestionsMap[wasteType].join(", ")}`);
      return;
    }

    try {
      // Update student points
      const updatedStudent = { ...student, points: student.points + 1 };
      await axios.put(`http://localhost:5000/students/${student.id}`, updatedStudent);
      setStudents(students.map((s) => (s.id === student.id ? updatedStudent : s)));

      // Increase bin fill by 5%
      const newFill = Math.min(bin.currentFill + 5, 100);
      const updatedBin = { ...bin, currentFill: newFill };
      await axios.put(`http://localhost:5000/bins/${bin.id}`, updatedBin);
      setBins(bins.map((b) => (b.id === bin.id ? updatedBin : b)));

      setMessage(`Correct disposal! 1 point added to ${student.name}.`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update. Try again.");
    }
  };

  // Only show one bin per type
  const binsToShow = ["Food Waste", "Plastic Waste", "Paper Waste"]
    .map((type) => bins.find((b) => b.wasteType === type))
    .filter(Boolean);

  return (
    <div className="container py-5" style={{ backgroundColor: "#e8f5e9", minHeight: "100vh" }}>
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h3 className="card-title text-success mb-3">Waste Classifier</h3>

              <input
                type="file"
                onChange={handleImageUpload}
                className="form-control mb-3"
              />
              {image && (
                <img
                  src={image}
                  alt="Uploaded Waste"
                  className="img-fluid rounded mb-3 border shadow-sm"
                  style={{ maxHeight: "250px" }}
                />
              )}

              <div className="mb-3">
                {wasteType ? (
                  <p className="text-primary fw-bold">Detected: {wasteType}</p>
                ) : (
                  <select
                    className="form-select"
                    onChange={(e) => setWasteType(e.target.value)}
                  >
                    <option value="">Select Waste Type</option>
                    <option value="Food Waste">Food Waste</option>
                    <option value="Plastic Waste">Plastic Waste</option>
                    <option value="Paper Waste">Paper Waste</option>
                  </select>
                )}
              </div>

              <input
                type="text"
                placeholder="Enter Student ID or Name"
                className="form-control mb-3"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />

              <button
                className={`btn btn-success w-100 mb-3 ${!wasteType ? "disabled" : ""}`}
                onClick={handleDispose}
              >
                Dispose Waste
              </button>

        {message && (
                <div
                    className={`alert mt-2 fw-bold ${
                    message.includes("almost full") ? "alert-danger" : "alert-info"
                    }`}
                >
                    {message}
                </div>
)}

            </div>
          </div>
        </div>
      </div>

      {/* Bin Capacities */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="text-success text-center mb-3">Bin Capacities</h4>
              {binsToShow.map((b) => (
                <div key={b.id} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>{b.wasteType} Bin</span>
                    <span>{b.currentFill}%</span>
                  </div>
                  <div className="progress">
                    <div
                      className={`progress-bar ${
                        b.wasteType === "Food Waste"
                          ? "bg-warning"
                          : b.wasteType === "Plastic Waste"
                          ? "bg-info"
                          : "bg-secondary"
                      }`}
                      role="progressbar"
                      style={{ width: `${b.currentFill}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WasteClassifier;
