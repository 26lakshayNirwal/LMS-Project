import React from "react";

const SummaryView = ({ summary, loading }) => {
  if (loading) {
    return <p className="mt-3">⏳ Generating summary...</p>;
  }

  if (!summary) return null;

  return (
    <div className="card mt-3 p-3">
      <h5>Summary:</h5>
      <pre style={{ whiteSpace: "pre-wrap" }}>{summary}</pre>
    </div>
  );
};

export default SummaryView;