function Home() {
  return (
    <div className="container py-5" style={{ minHeight: "100vh", backgroundColor: "#e8f5e9" }}>
      
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="text-success fw-bold">
          MCET Zero-Waste Campus
        </h1>
        <p className="lead text-dark mt-3">
          At MCET, we strive to reduce food, plastic, and paper waste using smart bins, AI classification, and real-time monitoring dashboards.
        </p>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3039/3039436.png" 
          alt="Zero Waste" 
          width="200" 
          className="mt-3 shadow rounded-circle"
        />
      </div>

      {/* Features Section */}
      <div className="row text-center g-4">
        <div className="col-md-4">
          <div className="card shadow h-100 border-success">
            <div className="card-body">
              <h5 className="card-title text-success fw-bold">AI Waste Classifier</h5>
              <p className="card-text">
                Identify the correct bin instantly using AI-assisted classification at MCET campus.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100 border-success">
            <div className="card-body">
              <h5 className="card-title text-success fw-bold">Smart Bins</h5>
              <p className="card-text">
                Monitor fill-levels in real-time and receive suggestions for alternate bins across MCET campus.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100 border-success">
            <div className="card-body">
              <h5 className="card-title text-success fw-bold">Impact Dashboard</h5>
              <p className="card-text">
                Track monthly impact, leaderboard, and student points for gamification within MCET.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="text-center mt-5">
        <a href="/WasteClassifier" className="btn btn-success btn-lg mx-2">Go to AI Classifier</a>
        <a href="/DashBoard" className="btn btn-outline-success btn-lg mx-2">View Dashboard</a>
        <a href="/PointsDashboard" className="btn btn-outline-success btn-lg mx-2">Leaderboard</a>
      </div>

    </div>
  );
}

export default Home;
