import { useEffect, useState } from "react";

function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("Welcome back, Student!");
  }, []);

  return (
    <div className="page-container">
      <div className="dashboard-card">
        <h1>Dashboard</h1>

        <h2>{message}</h2>

        <div className="dashboard-grid">
          <div className="info-card">
            <h3>Attendance</h3>
            <p>100%</p>
          </div>

          <div className="info-card">
            <h3>Semester</h3>
            <p>2nd Semester</p>
          </div>

          <div className="info-card">
            <h3>Courses</h3>
            <p>6 Courses</p>
          </div>

          <div className="info-card">
            <h3>Assignments</h3>
            <p>0 Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;