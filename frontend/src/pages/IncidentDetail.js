import { useEffect, useState } from "react";
import axios from "axios";

function IncidentDetail() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/dashboard/live")
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>📋 All Incidents</h2>

      {data.map(item => (
        <div key={item.id} style={{ border: "1px solid", margin: "10px" }}>
          <p>ID: {item.id}</p>
          <p>Component: {item.component_id}</p>
          <p>Status: {item.status}</p>
          <p>Severity: {item.severity}</p>
        </div>
      ))}
    </div>
  );
}

export default IncidentDetail;
