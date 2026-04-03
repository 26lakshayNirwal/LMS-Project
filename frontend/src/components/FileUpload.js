import React, { useState } from "react";

const FileUpload = ({ onSummarize, loading }) => {
  const [file, setFile] = useState(null);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card p-3">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              className="btn btn-secondary mt-3"
              onClick={() => onSummarize(file)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Summarise with AI"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;