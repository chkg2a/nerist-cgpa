import React from "react";

const ResultsDisplay = ({ finalGrades, sgpa, marks }) => {
  const parsedSgpa = parseFloat(sgpa) || 0;
  const percentage = (parsedSgpa * 10 - 5).toFixed(2);

  return (
    <div className="card p-3 p-md-4 border-0 shadow-sm rounded-3 bg-white mt-4 w-100">
      <div className="border-bottom pb-2 mb-3">
        <span className="badge bg-success mb-1">Local Storage Saved</span>
        <h3 className="h5 fw-bold text-dark mb-0 text-uppercase">Compiled Academic Score Report</h3>
      </div>
      
      {/* Top Level Summary KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6">
          <div className="bg-light rounded-3 p-4 text-center border border-secondary-subtle">
            <span className="text-secondary d-block small mb-1 fw-bold text-uppercase">Calculated Term SGPA</span>
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

      {/* Granular Marks and Grades Matrix Layout Table */}
      <div className="bg-light rounded-3 p-3 border border-secondary-subtle">
        <span className="text-secondary d-block small fw-bold text-uppercase mb-3 tracking-wide">Course Marks Breakdown Profile</span>
        <div className="table-responsive">
          <table className="table table-white table-hover align-middle mb-0 rounded-2 overflow-hidden shadow-xs">
            <thead className="table-dark">
              <tr className="font-monospace small">
                <th scope="col" className="ps-3 py-3">Course / Subject Title</th>
                <th scope="col" className="text-center py-3">Mid-Sem</th>
                <th scope="col" className="text-center py-3">End-Sem</th>
                <th scope="col" className="text-center py-3">Quiz</th>
                <th scope="col" className="text-center py-3">T. Eval</th>
                <th scope="col" className="text-center py-3">Prac</th>
                <th scope="col" className="text-center py-3">Weighted Total</th>
                <th scope="col" className="text-center pe-3 py-3">Final Grade</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(finalGrades).map(([subject, dataObject]) => {
                const grade = dataObject?.grade || "F";
                const isOverride = dataObject?.mode === "override";
                const badgeColor = grade === "S" || grade === "A" ? "success" : grade === "F" ? "danger" : "secondary";

                return (
                  <tr key={subject} className="small">
                    <td className="fw-bold text-dark ps-3 py-3">{subject}</td>
                    
                    {/* Render score values or show lock flags if overridden */}
                    <td className="text-center font-monospace text-muted py-3">
                      {isOverride ? "-" : (marks.MidSemExam?.[subject] ?? 0)}/30
                    </td>
                    <td className="text-center font-monospace text-muted py-3">
                      {isOverride ? "-" : (marks.EndSemExam?.[subject] ?? 0)}/50
                    </td>
                    <td className="text-center font-monospace text-muted py-3">
                      {isOverride ? "-" : (marks.Quiz?.[subject] ?? 0)}/10
                    </td>
                    <td className="text-center font-monospace text-muted py-3">
                      {isOverride ? "-" : (marks.TeacherEval?.[subject] ?? 0)}/10
                    </td>
                    <td className="text-center font-monospace text-muted py-3">
                      {isOverride ? "-" : (marks.PracExam?.[subject] !== undefined ? `${marks.PracExam[subject]}/50` : "-")}
                    </td>
                    
                    <td className="text-center font-monospace fw-bold text-primary py-3">
                      {isOverride ? <span className="text-muted font-normal small">Override Mode</span> : `${dataObject?.score || 0} %`}
                    </td>
                    
                    <td className="text-center pe-3 py-3">
                      <span className={`badge bg-${badgeColor} rounded-pill px-3 py-2 font-monospace fw-bold`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
