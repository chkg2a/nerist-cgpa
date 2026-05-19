import React from "react";

const ResultsDisplay = ({ finalGrades, sgpa }) => {
  const parsedSgpa = parseFloat(sgpa) || 0;
  const percentage = (parsedSgpa * 10 - 5).toFixed(2);

  return (
    <div className="card p-3 p-md-4 border-0 shadow-sm rounded-3 bg-white mt-4">
      <div className="border-bottom pb-2 mb-3">
        <span className="badge bg-success mb-1">Metrics Calculated</span>
        <h3 className="h5 fw-bold text-dark mb-0 text-uppercase">Term Performance Indexes</h3>
      </div>
      
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6">
          <div className="bg-light rounded-3 p-4 text-center border border-secondary-subtle">
            <span className="text-secondary d-block small mb-1 fw-bold text-uppercase">Calculated SGPA</span>
            <span className="h1 fw-black text-primary d-block mb-0 font-monospace">{parsedSgpa.toFixed(2)}</span>
          </div>
        </div>
        <div className="col-12 col-sm-6">
          <div className="bg-light rounded-3 p-4 text-center border border-secondary-subtle">
            <span className="text-secondary d-block small mb-1 fw-bold text-uppercase">Percentage Equivalent</span>
            <span className="h1 fw-black text-dark d-block mb-0 font-monospace">{percentage}%</span>
          </div>
        </div>
      </div>

      <div className="bg-light rounded-3 p-3 border border-light-subtle">
        <span className="text-secondary d-block small fw-bold text-uppercase mb-2 tracking-wide">Detailed Course Grade Mapping</span>
        <div className="overflow-auto" style={{ maxHeight: "220px" }}>
          {Object.entries(finalGrades).map(([subject, grade]) => {
            const badgeColor = grade === "S" || grade === "A" ? "success" : grade === "F" ? "danger" : "secondary";
            return (
              <div key={subject} className="d-flex justify-content-between align-items-center py-2.5 border-bottom border-light-subtle bg-white px-3 my-1 rounded-2 shadow-xs">
                <span className="small text-dark fw-bold text-wrap me-3" style={{ maxWidth: "75%" }}>{subject}</span>
                <div className="font-monospace text-nowrap">
                  <span className={`badge bg-${badgeColor} rounded-pill px-3 py-2 fs-6`}>{grade} Grade</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
