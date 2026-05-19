import React, { useState, useEffect } from "react";

const CGPAPredictor = ({ module, discipline, currentSemester, currentSGPA, subjectsData }) => {
  const [totalSemesters, setTotalSemesters] = useState("8");
  const [historicalSGPAs, setHistoricalSGPAs] = useState({});
  const [targetCGPA, setTargetCGPA] = useState("");
  const [predictionResult, setPredictionResult] = useState(null);

  // Automatically adjust max semesters when parent module context switches
  useEffect(() => {
    if (module) {
      const lowerModule = module.toLowerCase();
      if (lowerModule.includes("base") || lowerModule.includes("diploma")) {
        setTotalSemesters("6");
      } else if (lowerModule.includes("phd") || lowerModule.includes("m.tech") || lowerModule.includes("m.sc")) {
        setTotalSemesters("4");
      } else {
        setTotalSemesters("8");
      }
    }
  }, [module]);

  // CRASH FIX: Added strict multi-layer fallback checks to catch unconfigured semesters smoothly
  const getSemesterTotalCredits = (semNumber) => {
    if (!subjectsData || !module || !discipline) return 0;
    
    const targetModuleData = subjectsData[module];
    if (!targetModuleData) return 0;
    
    const targetDisciplineData = targetModuleData[discipline];
    if (!targetDisciplineData) return 0;
    
    const semData = targetDisciplineData[String(semNumber)];
    if (!semData || typeof semData !== "object") return 0; // Return 0 credits if JSON entry doesn't exist yet

    return Object.values(semData).reduce((sum, course) => {
      if (!course || typeof course !== "object") return sum;
      return sum + (Number(course.weight) || 0);
    }, 0);
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

    if (totalProgramCredits === 0) {
      setPredictionResult({
        status: "warning",
        message: "No standard credit weight metrics could be discovered inside the active configuration profiles."
      });
      return;
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
    let futureSemsCount = 0;
    for (let i = currentSemNum + 1; i <= maxSem; i++) {
      futureCreditsWeight += getSemesterTotalCredits(i);
      futureSemsCount++;
    }

    const totalPointsRequired = targetValue * totalProgramCredits;
    const missingPointsGap = totalPointsRequired - pastEarnedPoints - (baselineRunningAvg * futureCreditsWeight);
    const requiredActiveSGPA = activeSemCredits > 0 ? (missingPointsGap / activeSemCredits) : 0;

    if (requiredActiveSGPA > 10) {
      setPredictionResult({
        status: "danger",
        message: `<strong>Target Unattainable.</strong> To finish with an overall CGPA of <strong>${targetValue}</strong>, you would need an impossible SGPA score of <strong>${requiredActiveSGPA.toFixed(2)}</strong> in Semester ${currentSemNum} (assuming subsequent terms continue at your historical average of ${baselineRunningAvg.toFixed(2)}).`
      });
    } else if (requiredActiveSGPA < 0) {
      setPredictionResult({
        status: "success",
        message: `<strong>Target Secured!</strong> Your tracking metrics place you safely ahead. You can score a 0.00 in Semester ${currentSemNum} and still achieve your goal.`
      });
    } else {
      setPredictionResult({
        status: "info",
        message: `<strong>Target Lock:</strong> To reach an overall graduation goal of <strong>${targetValue}</strong> CGPA, you must achieve an SGPA of exactly <strong>${requiredActiveSGPA.toFixed(2)}</strong> in <strong>Semester ${currentSemNum}</strong>, assuming subsequent terms match your historical baseline average of ${baselineRunningAvg.toFixed(2)}.`
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
        <select className="form-select form-select-lg border-secondary-subtle py-2.5 fw-semibold" value={totalSemesters} onChange={(e) => setTotalSemesters(e.target.value)}>
          <option value="4">4 Semesters (M.Tech / M.Sc / PhD)</option>
          <option value="6">6 Semesters (Diploma Module / Base)</option>
          <option value="8">8 Semesters (B.Tech Degree Module)</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary d-block mb-1">Semester SGPA Matrix Log</label>
        <small className="text-muted d-block mb-3">
          All slots are fully editable. Modify entries to simulate different targets.
        </small>
        
        <div className="row g-3 overflow-auto p-2 border rounded bg-light mx-0 shadow-inner" style={{ maxHeight: "360px" }}>
          {Array.from({ length: parseInt(totalSemesters) || 8 }, (_, i) => i + 1).map((sem) => {
            const isCurrent = currentSemNum === sem;
            const credits = getSemesterTotalCredits(sem);

            return (
              <div key={sem} className="col-12">
                <div className={`card p-3 border ${isCurrent ? 'border-primary bg-primary-subtle' : 'border-light-subtle bg-white'} mb-0 shadow-xs`}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className={`badge ${isCurrent ? "bg-primary" : "bg-secondary"} font-monospace fs-6 me-2 px-2.5 py-2`}>S{sem}</span>
                      <small className="text-muted font-monospace fs-6 fw-bold">{credits} Credits</small>
                    </div>
                    <div style={{ width: "130px" }}>
                      <input
                        type="number" step="0.01" min="0" max="10" 
                        placeholder={isCurrent && currentSGPA ? currentSGPA : "0.00"}
                        className={`form-control form-control-lg text-center font-monospace fw-bold no-spinners py-2 ${isCurrent ? "border-primary text-primary bg-white fs-4" : "fs-4"}`}
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
        <label className="form-label small fw-bold text-primary fs-5 mb-2">Objective Graduation Target CGPA</label>
        <div className="d-flex align-items-center justify-content-between bg-light border border-primary border-2 rounded p-2 px-4 shadow-sm">
          <span className="h5 text-secondary fw-bold mb-0">Target CGPA Goal:</span>
          <input
            type="number" step="0.01" min="0" max="10" placeholder="0.00"
            className="form-control text-center border-0 bg-transparent font-monospace fw-black text-primary no-spinners p-2 fs-3"
            style={{ maxWidth: "150px" }}
            value={targetCGPA} onChange={(e) => setTargetCGPA(e.target.value)}
          />
        </div>
      </div>

      <button onClick={executeAnalysis} className="btn btn-dark btn-lg w-100 py-3 fw-bold fs-5 rounded-3 shadow-sm">
        Calculate Needed Semester Target
      </button>

      {predictionResult && (
        <div className={`mt-3 alert alert-${predictionResult.status} border-0 p-3 fs-6 rounded-3 shadow-sm`} role="alert">
          <div dangerouslySetInnerHTML={{ __html: predictionResult.message }} />
        </div>
      )}
    </div>
  );
};

export default CGPAPredictor;
