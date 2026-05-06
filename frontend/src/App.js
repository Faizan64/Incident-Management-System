import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IncidentDetail from "./pages/IncidentDetail";
import RCAForm from "./pages/RCAForm";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Dashboard</Link> | 
        <Link to="/incidents">Incidents</Link> | 
        <Link to="/rca">RCA</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/incidents" element={<IncidentDetail />} />
        <Route path="/rca" element={<RCAForm />} />
      </Routes>
    </Router>
  );
}

export default App;
