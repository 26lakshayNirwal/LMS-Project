import React, { useState } from "react";

const FileUpload = ({ onSummarize, loading }) => {
  const [file, setFile] = useState(null);

  return (
    <div className="card p-3 mt-3">
      <input
        type="file"
        className="form-control"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="btn btn-primary mt-3"
        onClick={() => onSummarize(file)}
        disabled={loading}
      >
        {loading ? "Processing..." : "Summarise with AI"}
      </button>
    </div>
  );
};

export default FileUpload;