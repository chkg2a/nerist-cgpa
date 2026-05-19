import React from "react";

const SubjectInput = ({ subject, marks, weight, overrideGrades, handleInputChange, handleGradeOverride, gradePoint }) => {
  const currentOverride = overrideGrades[subject] || "";

  // Dynamic CSS injector to strip browser numeric spin buttons
  const noSpinStyle = `
    .no-spinners::-webkit-outer-spin-button,
    .no-spinners::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .no-spinners {
      -moz-appearance: textfield;
    }
  `;

  return (
    <div className="card p-3 p-md-4 border border-secondary-subtle bg-light rounded-3 mb-4 shadow-sm w-100">
      <style>{noSpinStyle}</style>
      
      <div className="row align-items-center g-3 mb-3">
        <div className="col-12 col-md-8">
          <h4 className="h5 fw-bold text-dark mb-1">{subject}</h4>
          <span className="badge bg-secondary font-monospace me-2" style={{ fontSize: '0.8rem' }}>L-T-P: {gradePoint || "0-0-0"}</span>
          <span className="badge bg-dark font-monospace" style={{ fontSize: '0.8rem' }}>Credits: {weight}</span>
        </div>
        
        {/* Direct Selection Dropdown Option Overrider */}
        <div className="col-12 col-md-4 text-md-end">
          <div className="d-flex align-items-center justify-content-md-end gap-2">
            <span className="small fw-bold text-primary text-nowrap">Direct Grade:</span>
            <select 
              className="form-select border-primary font-monospace fw-bold text-center" 
              style={{ maxWidth: "180px" }}
              value={currentOverride}
              onChange={(e) => handleGradeOverride(subject, e.target.value)}
            >
              <option value="">-- Raw Marks --</option>
              <option value="S">S Grade (10)</option>
              <option value="A">A Grade (9)</option>
              <option value="B">B Grade (8)</option>
              <option value="C">C Grade (7)</option>
              <option value="D">D Grade (6)</option>
              <option value="E">E Grade (5)</option>
              <option value="F">F Grade (0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inputs Matrix - Re-engineered to fill the container fully */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-3 w-100 m-0">
        <div className="col p-1">
          <div className="bg-white border rounded p-2.5 px-3 d-flex align-items-center justify-content-between shadow-xs w-100">
            <span className="small fw-bold text-muted text-uppercase mb-0 me-2">Mid-Sem</span>
            <div className="input-group" style={{ maxWidth: "140px" }}>
              <input type="number" min="0" max="30" className="form-control text-center font-monospace fw-bold no-spinners px-2" value={marks.MidSemExam?.[subject] ?? ""} onChange={(e) => handleInputChange(e, "MidSemExam", subject)} disabled={currentOverride !== ""} placeholder="0" />
              <span className="input-group-text bg-light text-muted font-monospace small px-2">/30</span>
            </div>
          </div>
        </div>
        
        <div className="col p-1">
          <div className="bg-white border rounded p-2.5 px-3 d-flex align-items-center justify-content-between shadow-xs w-100">
            <span className="small fw-bold text-muted text-uppercase mb-0 me-2">End-Sem</span>
            <div className="input-group" style={{ maxWidth: "140px" }}>
              <input type="number" min="0" max="50" className="form-control text-center font-monospace fw-bold no-spinners px-2" value={marks.EndSemExam?.[subject] ?? ""} onChange={(e) => handleInputChange(e, "EndSemExam", subject)} disabled={currentOverride !== ""} placeholder="0" />
              <span className="input-group-text bg-light text-muted font-monospace small px-2">/50</span>
            </div>
          </div>
        </div>
        
        <div className="col p-1">
          <div className="bg-white border rounded p-2.5 px-3 d-flex align-items-center justify-content-between shadow-xs w-100">
            <span className="small fw-bold text-muted text-uppercase mb-0 me-2">Quiz Test</span>
            <div className="input-group" style={{ maxWidth: "140px" }}>
              <input type="number" min="0" max="10" className="form-control text-center font-monospace fw-bold no-spinners px-2" value={marks.Quiz?.[subject] ?? ""} onChange={(e) => handleInputChange(e, "Quiz", subject)} disabled={currentOverride !== ""} placeholder="0" />
              <span className="input-group-text bg-light text-muted font-monospace small px-2">/10</span>
            </div>
          </div>
        </div>
        
        <div className="col p-1">
          <div className="bg-white border rounded p-2.5 px-3 d-flex align-items-center justify-content-between shadow-xs w-100">
            <span className="small fw-bold text-muted text-uppercase mb-0 me-2">Tchr Eval</span>
            <div className="input-group" style={{ maxWidth: "140px" }}>
              <input type="number" min="0" max="10" className="form-control text-center font-monospace fw-bold no-spinners px-2" value={marks.TeacherEval?.[subject] ?? ""} onChange={(e) => handleInputChange(e, "TeacherEval", subject)} disabled={currentOverride !== ""} placeholder="0" />
              <span className="input-group-text bg-light text-muted font-monospace small px-2">/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Lab Input Strip - Expanded to match row parameters */}
      {gradePoint?.split("-")[2] !== "0" && gradePoint && (
        <div className="w-100 p-0 m-0">
          <div className="bg-white border border-primary-subtle rounded p-2.5 px-3 d-flex align-items-center justify-content-between shadow-xs w-100">
            <span className="small fw-bold text-primary text-uppercase mb-0">Practical Lab Evaluation</span>
            <div className="input-group" style={{ maxWidth: "140px" }}>
              <input type="number" min="0" max="50" className="form-control text-center font-monospace fw-bold no-spinners border-primary text-primary px-2" value={marks.PracExam?.[subject] ?? ""} onChange={(e) => handleInputChange(e, "PracExam", subject)} disabled={currentOverride !== ""} placeholder="0" />
              <span className="input-group-text bg-white text-primary border-primary font-monospace small px-2">/50</span>
            </div>
          </div>
        </div>
      )}
      
      {currentOverride && (
        <div className="mt-2 text-primary" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
          * Evaluation scoring input fields are locked because the direct letter grade <strong>"{currentOverride}"</strong> option is currently chosen.
        </div>
      )}
    </div>
  );
};

export default SubjectInput;
