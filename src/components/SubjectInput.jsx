import React from "react";

const SubjectInput = ({ subject, marks, weight, overrideGrades, handleInputChange, handleGradeOverride, gradePoint }) => {
  const currentOverride = overrideGrades[subject] || "";

  // Dynamic CSS injector to strip out browser numeric spin button arrows
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
      
      {/* Header Info Section */}
      <div className="row align-items-center g-3 mb-4 m-0 w-100">
        <div className="col-12 col-md-8 p-0">
          <h4 className="h4 fw-bold text-dark mb-1">{subject}</h4>
          <span className="badge bg-secondary font-monospace me-2 p-2" style={{ fontSize: '0.85rem' }}>L-T-P: {gradePoint || "0-0-0"}</span>
          <span className="badge bg-dark font-monospace p-2" style={{ fontSize: '0.85rem' }}>Credits: {weight}</span>
        </div>
        
        {/* Direct Selection Dropdown Overrider */}
        <div className="col-12 col-md-4 p-0 text-md-end">
          <div className="d-flex align-items-center justify-content-start justify-content-md-end gap-2">
            <span className="small fw-bold text-primary text-nowrap fs-5">Direct Grade:</span>
            <select 
              className="md:w-[300px] maxform-select form-select-lg border-primary font-monospace fw-bold text-center py-2 bg-blue-200" 
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

      {/* Inputs Matrix - Maintained strictly as vertically stacked rows with large paddings */}
      <div className="d-flex flex-column gap-3 w-100 p-0 m-0">
        
        {/* Mid-Sem Input Block */}
        <div className="w-100 bg-white border rounded p-3 d-flex align-items-center justify-content-between shadow-xs">
          <span className="h5 fw-bold text-secondary text-uppercase mb-0 tracking-wide">Mid-Sem</span>
          <div className="input-group input-group-lg" style={{ maxWidth: "160px" }}>
            <input type="number" min="0" max="30" className="form-control text-center font-monospace fw-bold no-spinners fs-4 py-2.5" value={marks.MidSemExam?.[subject] ?? ""} onChange={(e) => handleInputChange(e, "MidSemExam", subject)} disabled={currentOverride !== ""} placeholder="0" />
            <span className="input-group-text bg-light text-muted font-monospace fw-bold fs-5 px-3">/30</span>
          </div>
        </div>
        
        {/* End-Sem Input Block */}
        <div className="w-100 bg-white border rounded p-3 d-flex align-items-center justify-content-between shadow-xs">
          <span className="h5 fw-bold text-secondary text-uppercase mb-0 tracking-wide">End-Sem</span>
          <div className="input-group input-group-lg" style={{ maxWidth: "160px" }}>
            <input type="number" min="0" max="50" className="form-control text-center font-monospace fw-bold no-spinners fs-4 py-2.5" value={marks.EndSemExam?.[subject] ?? ""} onChange={(e) => handleInputChange(e, "EndSemExam", subject)} disabled={currentOverride !== ""} placeholder="0" />
            <span className="input-group-text bg-light text-muted font-monospace fw-bold fs-5 px-3">/50</span>
          </div>
        </div>
        
        {/* Quiz Test Input Block */}
        <div className="w-100 bg-white border rounded p-3 d-flex align-items-center justify-content-between shadow-xs">
          <span className="h5 fw-bold text-secondary text-uppercase mb-0 tracking-wide">Quiz Test</span>
          <div className="input-group input-group-lg" style={{ maxWidth: "160px" }}>
            <input type="number" min="0" max="10" className="form-control text-center font-monospace fw-bold no-spinners fs-4 py-2.5" value={marks.Quiz?.[subject] ?? ""} onChange={(e) => handleInputChange(e, "Quiz", subject)} disabled={currentOverride !== ""} placeholder="0" />
            <span className="input-group-text bg-light text-muted font-monospace fw-bold fs-5 px-3">/10</span>
          </div>
        </div>
        
        {/* Teacher Evaluation Input Block */}
        <div className="w-100 bg-white border rounded p-3 d-flex align-items-center justify-content-between shadow-xs">
          <span className="h5 fw-bold text-secondary text-uppercase mb-0 tracking-wide">Tchr Eval</span>
          <div className="input-group input-group-lg" style={{ maxWidth: "160px" }}>
            <input type="number" min="0" max="10" className="form-control text-center font-monospace fw-bold no-spinners fs-4 py-2.5" value={marks.TeacherEval?.[subject] ?? ""} onChange={(e) => handleInputChange(e, "TeacherEval", subject)} disabled={currentOverride !== ""} placeholder="0" />
            <span className="input-group-text bg-light text-muted font-monospace fw-bold fs-5 px-3">/10</span>
          </div>
        </div>

        {/* Practical Lab Evaluation Input Block */}
        {gradePoint?.split("-")[2] !== "0" && gradePoint && (
          <div className="w-100 bg-white border border-primary-subtle rounded p-3 d-flex align-items-center justify-content-between shadow-xs">
            <span className="h5 fw-bold text-primary text-uppercase mb-0 tracking-wide">Practical Lab</span>
            <div className="input-group input-group-lg" style={{ maxWidth: "160px" }}>
              <input type="number" min="0" max="50" className="form-control text-center font-monospace fw-bold no-spinners border-primary text-primary fs-4 py-2.5" value={marks.PracExam?.[subject] ?? ""} onChange={(e) => handleInputChange(e, "PracExam", subject)} disabled={currentOverride !== ""} placeholder="0" />
              <span className="input-group-text bg-white text-primary border-primary font-monospace fw-bold fs-5 px-3">/50</span>
            </div>
          </div>
        )}

      </div>
      
      {currentOverride && (
        <div className="mt-3 text-primary text-start fs-6 fw-semibold">
          * Evaluation scoring input fields are locked because the direct letter grade <strong>"{currentOverride}"</strong> option is currently chosen.
        </div>
      )}
    </div>
  );
};

export default SubjectInput;
