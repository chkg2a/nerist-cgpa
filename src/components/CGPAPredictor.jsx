import React, { useState, useEffect } from "react";

const CGPAPredictor = ({ module, discipline, currentSemester, currentSGPA, subjectsData }) => {
  const [totalSemesters, setTotalSemesters] = useState("8");
  const [historicalSGPAs, setHistoricalSGPAs] = useState({});
  const [targetCGPA, setTargetCGPA] = useState("");
  const [predictionResult, setPredictionResult] = useState(null);

  // Auto-sync duration configurations whenever parent program modules alter
  useEffect(() => {
    if (module) {
      const lowerModule = module.toLowerCase();
      if (lowerModule.includes("base") || lowerModule.includes("diploma")) {
        setTotalSemesters("6");
      } else if (lowerModule.includes("phd") || lowerModule.includes("m.tech") || lowerModule.includes("m.sc")) {
        setTotalSemesters("4");
      } else {
        setTotalSemesters("8"); // Default fallback option tailored for standard Degree modules
      }
    }
  }, [module]);

  const getSemesterTotalCredits = (semNumber) => {
    const semData = subjectsData[module]?.[discipline]?.[String(semNumber)];
    if (!semData) return 0;
    return Object.values(semData).reduce((sum, course) => sum + (course.weight || 0), 0);
  };

  useEffect(() => {
    if (currentSemester && currentSGPA) {
      setHistoricalSGPAs((prev) => ({
        ...prev,
        [currentSemester]: currentSGPA,
      }));
    }
  }, [currentSemester, currentSGPA]);

  const handleSGPAChange = (sem, val) => {
    if (val === "" || (Number(val) >= 0 && Number(val) <= 10)) {
      setHistoricalSGPAs((prev) => ({ ...prev, [sem]: val }));
    }
  };

  const executeAnalysis = () => {
    const maxSem = parseInt(totalSemesters) || 8;
    const currentSemNum = parseInt(currentSemester);
    
    if (!targetCGPA) {
      setPredictionResult({
        status: "secondary",
        message: "Please enter your objective graduation goal CGPA target metric."
      });
      return;
    }

    const targetValue = parseFloat(targetCGPA);
    let totalProgramCredits = 0;
    for (let i = 1; i <= maxSem; i++) {
      totalProgramCredits += getSemesterTotalCredits(i);
    }

    let pastEarnedPoints = 0;
    let pastTotalCredits = 0;
    let pastSGPAsum = 0;
    let pastSGPACount = 0;

    for (let i = 1; i < currentSemNum; i++) {
      const credits = getSemesterTotalCredits(i);
      if (historicalSGPAs[i] && historicalSGPAs[i] !== "") {
        const pastSGPA = parseFloat(historicalSGPAs[i]);
        pastEarnedPoints += pastSGPA * credits;
        pastTotalCredits += credits;
        pastSGPAsum += pastSGPA;
        pastSGPACount++;
      }
    }

    const baselineRunningAvg = pastSGPACount > 0 ? (pastSGPAsum / pastSGPACount) : 7.5; 
    const activeSemCredits = getSemesterTotalCredits(currentSemNum);
    
    let futureCreditsWeight = 0;
    for (let i = currentSemNum + 1; i <= maxSem; i++) {
      futureCreditsWeight += getSemesterTotalCredits(i);
    }

    const totalPointsRequired = targetValue * totalProgramCredits;
    const missingPointsGap = totalPointsRequired - pastEarnedPoints - (baselineRunningAvg * futureCreditsWeight);
    const requiredActiveSGPA = activeSemCredits > 0 ? (missingPointsGap / activeSemCredits) : 0;

    if (requiredActiveSGPA > 10) {
      setPredictionResult({
        status: "danger",
        message: `<strong>Target Unattainable.</strong> To finish with an overall CGPA of <strong>${targetValue}</strong>, you would need an impossible SGPA score of <strong>${requiredActiveSGPA.toFixed(2)}</strong> in Semester ${currentSemNum} (assuming subsequent terms run at your baseline history average of ${baselineRunningAvg.toFixed(2)}).`
      });
    } else if (requiredActiveSGPA < 0) {
      setPredictionResult({
        status: "success",
        message: `<strong>Target Already Secured!</strong> Your tracking metrics place you safely ahead. You could theoretically score a 0.00 in Semester ${currentSemNum} and still hit your overall goal.`
      });
    } else {
      setPredictionResult({
        status: "info",
        message: `<strong>Target Lock:</strong> To clear graduation with your goal of <strong>${targetValue}</strong> CGPA, you must achieve an SGPA of exactly <strong>${requiredActiveSGPA.toFixed(2)}</strong> in <strong>Semester ${currentSemNum}</strong>, assuming your other terms continue at your historical average baseline of ${baselineRunningAvg.toFixed(2)}.`
      });
    }
  };

  const currentSemNum = parseInt(currentSemester) || 1;

  return (
    <div className="card p-4 border-0 shadow-sm rounded-3 bg-white h-100">
      <div className="border-bottom pb-2 mb-3">
        <span className="badge bg-primary mb-1">Target Engine</span>
        <h3 className="h5 fw-bold text-dark mb-0 text-uppercase">Graduation Pathway Modeler</h3>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary">Total Course Duration</label>
        <select className="form-select border-secondary-subtle py-2 fw-semibold" value={totalSemesters} onChange={(e) => setTotalSemesters(e.target.value)}>
          <option value="4">4 Semesters (M.Tech / M.Sc / PhD)</option>
          <option value="6">6 Semesters (Diploma Module / Base)</option>
          <option value="8">8 Semesters (B.Tech Degree Module)</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary d-block mb-1">Semester SGPA Matrix Log</label>
        <small className="text-muted d-block mb-3">
          All slots are fully editable. Modify prior entries or override values to simulate custom academic paths.
        </small>
        
        <div className="row g-2 overflow-auto p-2 border rounded bg-light mx-0" style={{ maxHeight: "300px" }}>
          {Array.from({ length: parseInt(totalSemesters) || 8 }, (_, i) => i + 1).map((sem) => {
            const isCurrent = currentSemNum === sem;
            const credits = getSemesterTotalCredits(sem);

            return (
              <div key={sem} className="col-12 col-sm-6">
                <div className={`card p-2 border ${isCurrent ? 'border-primary bg-primary-subtle' : 'border-light-subtle bg-white'} mb-0 shadow-xs`}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className={`badge ${isCurrent ? "bg-primary" : "bg-secondary"} font-monospace me-1`}>S{sem}</span>
                      <small className="text-muted font-monospace small fw-bold">{credits} Cr</small>
                    </div>
                    <div style={{ width: "100px" }}>
                      <input
                        type="number" step="0.01" min="0" max="10" 
                        placeholder={isCurrent && currentSGPA ? currentSGPA : "0.00"}
                        className={`form-control form-control-sm text-center font-monospace fw-bold no-spinners px-1 ${isCurrent ? "border-primary text-primary bg-white" : ""}`}
                        value={historicalSGPAs[sem] || ""}
                        onChange={(e) => handleSGPAChange(sem, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4 pt-3 border-top">
        <label className="form-label small fw-bold text-primary">Objective Graduation Target CGPA</label>
        <div className="d-flex align-items-center justify-content-between bg-light border border-primary rounded p-1 px-3 shadow-xs">
          <span className="small text-secondary fw-bold">Target CGPA Goal:</span>
          <input
            type="number" step="0.01" min="0" max="10" placeholder="e.g. 8.50"
            className="form-control text-center border-0 bg-transparent font-monospace fw-bold text-primary no-spinners p-1 fs-5"
            style={{ maxWidth: "120px" }}
            value={targetCGPA} onChange={(e) => setTargetCGPA(e.target.value)}
          />
        </div>
      </div>

      <button onClick={executeAnalysis} className="btn btn-dark w-100 py-3 fw-bold fs-6 rounded-3 shadow-sm">
        Calculate Needed Semester Target
      </button>

      {predictionResult && (
        <div className={`mt-3 alert alert-${predictionResult.status} border-0 p-3 fs-6 rounded-3 shadow-xs`} role="alert">
          <div dangerouslySetInnerHTML={{ __html: predictionResult.message }} />
        </div>
      )}
    </div>
  );
};

export default CGPAPredictor;
