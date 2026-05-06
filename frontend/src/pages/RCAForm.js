import React, { useState } from "react";
import axios from "axios";

function RCAForm() {
  const [form, setForm] = useState({
    workItemId: "",
    rootCause: "",
    fix: "",
    prevention: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      await axios.post("http://localhost:3000/rca/submit-rca", form);
      alert("RCA Submitted");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error submitting RCA");
    }
  };

  return (
    <div>
      <h3>Submit RCA</h3>

      <input name="workItemId" placeholder="Work Item ID" onChange={handleChange} />
      <input name="rootCause" placeholder="Root Cause" onChange={handleChange} />
      <input name="fix" placeholder="Fix" onChange={handleChange} />
      <input name="prevention" placeholder="Prevention" onChange={handleChange} />

      <input type="datetime-local" name="startTime" onChange={handleChange} />
      <input type="datetime-local" name="endTime" onChange={handleChange} />

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default RCAForm;
