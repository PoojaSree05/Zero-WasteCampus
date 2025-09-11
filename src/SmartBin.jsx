import { useState, useEffect } from "react";
import axios from "axios";

function SmartBinNotification() {
  const [bins, setBins] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch bin data from JSON server
  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await axios.get("http://localhost:5000/bins");
        setBins(res.data);
        checkNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBins();
  }, []);

  const checkNotifications = (binsData) => {
    const alerts = binsData
      .filter(b => b.currentFill >= 90)
      .map(b => `${b.wasteType} Bin is full! Please attend to it.`);
    setNotifications(alerts);
  };

  // Optional: reset a bin (simulate cleaner action)
  const handleResetBin = async (binId) => {
    const bin = bins.find(b => b.id === binId);
    if (!bin) return;
    const updatedBin = { ...bin, currentFill: 20 }; // reset to 20% for simulation
    try {
      await axios.put(`http://localhost:5000/bins/${bin.id}`, updatedBin);
      const updatedBins = bins.map(b => b.id === bin.id ? updatedBin : b);
      setBins(updatedBins);
      checkNotifications(updatedBins);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5 text-center">
      <h2 className="text-success mb-4">Smart Bin Notifications</h2>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-4">
          {notifications.map((note, idx) => (
            <div key={idx} className="alert alert-danger fw-bold">
              {note}
            </div>
          ))}
        </div>
      )}

      {/* Bin Status */}
      <div className="row justify-content-center">
        {bins.map(b => (
          <div key={b.id} className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{b.wasteType} Bin</h5>
                <div className="progress mb-2">
                  <div
                    className={`progress-bar ${b.wasteType === "Food Waste" ? "bg-success" : b.wasteType === "Plastic Waste" ? "bg-primary" : "bg-secondary"}`}
                    role="progressbar"
                    style={{ width: `${b.currentFill}%` }}
                  >
                    {b.currentFill}%
                  </div>
                </div>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleResetBin(b.id)}
                >
                  Reset Bin
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SmartBinNotification;
