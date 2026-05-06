import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios.get("http://localhost:3000/dashboard/live")
        .then(res => setData(res.data));
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>🚨 Live Incidents</h2>

      {data.map((item, index) => (
        <div key={index} style={{ border: "1px solid", margin: "10px", padding: "10px" }}>
          <p><b>Component:</b> {item.componentId}</p>
          <p><b>Severity:</b> {item.severity}</p>
          <p><b>Status:</b> {item.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
