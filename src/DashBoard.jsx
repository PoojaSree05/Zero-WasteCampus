import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function DashBoard({ bins }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && bins.length) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy previous chart instance
      if (chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }

      // Prepare data dynamically from bins
      const data = bins.map((b) => b.currentFill);
      const labels = bins.map((b) => b.wasteType);

      chartRef.current.chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: ["#28a745", "#17a2b8", "#ffc107"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
          },
        },
      });
    }
  }, [bins]); // Re-run whenever bins change

  return (
    <div className="text-center">
      <h2 className="text-success mb-4">Waste Management Dashboard</h2>
      <div style={{ width: "400px", height: "400px", margin: "0 auto" }}>
        <canvas ref={chartRef}></canvas>
      </div>

      <div className="mt-4">
        <h4 className="text-success mb-3">Bin Capacities</h4>
        <div className="d-flex flex-column align-items-center">
          {bins.map((b) => (
            <div key={b.id} className="mb-3 w-75">
              <div className="d-flex justify-content-between mb-1">
                <span>{b.wasteType} Bin</span>
                <span>{b.currentFill}%</span>
              </div>
              <div className="progress">
                <div
                  className={`progress-bar ${
                    b.wasteType === "Food Waste"
                      ? "bg-success"
                      : b.wasteType === "Plastic Waste"
                      ? "bg-info"
                      : "bg-warning"
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
  );
}

export default DashBoard;
