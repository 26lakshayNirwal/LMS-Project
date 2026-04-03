import React, { useState } from "react";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import SummaryView from "../components/SummaryView";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Dashboard = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async (file) => {
    if (!file) return;

    setLoading(true);
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/summarize`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setSummary(data.summary);

    } catch {
      setSummary("Error summarizing");
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <h3>LMS Dashboard</h3>

        <FileUpload onSummarize={handleSummarize} loading={loading} />
        <SummaryView summary={summary} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;