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
    formData.append("title", file.name);

    try {
      // Step 1: Upload document to database
      const uploadRes = await fetch(`${API_BASE_URL}/api/docs/upload`, {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) {
        setSummary("Error uploading document");
        setLoading(false);
        return;
      }

      const uploadData = await uploadRes.json();
      console.log("Document uploaded:", uploadData);

      // Step 2: Summarize the document
      const summarizeFormData = new FormData();
      summarizeFormData.append("file", file);

      const summarizeRes = await fetch(`${API_BASE_URL}/api/summarize`, {
        method: "POST",
        body: summarizeFormData
      });

      const summaryData = await summarizeRes.json();
      setSummary(summaryData.summary);

    } catch (error) {
      console.error("Error:", error);
      setSummary("Error processing document");
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