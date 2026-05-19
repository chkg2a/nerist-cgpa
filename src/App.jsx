import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import subjectsData from "./subjects.json";
import DisciplineSelector from "./components/DisciplineSelector";
import SubjectsList from "./components/SubjectsList";
import ResultsDisplay from "./components/ResultsDisplay";
import CGPAPredictor from "./components/CGPAPredictor";
import { FaGithub } from "react-icons/fa6";
import { weightDistribution, gradesScale, maxValues } from "./utils/constants";

const App = () => {
  const [module, setModule] = useState(""); 
  const [discipline, setDiscipline] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState({});
  const [marks, setMarks] = useState({
    MidSemExam: {}, EndSemExam: {}, Quiz: {}, TeacherEval: {}, PracExam: {},
  });
  const [overrideGrades, setOverrideGrades] = useState({});
  const [finalGrades, setFinalGrades] = useState({});
  const [sgpa, setSgpa] = useState(null);

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem("gradeResults"));
    if (savedResults) {
      setModule(savedResults.module || "");
      setDiscipline(savedResults.discipline || "");
      setSemester(savedResults.semester || "");
      setMarks(savedResults.marks || { MidSemExam: {}, EndSemExam: {}, Quiz: {}, TeacherEval: {}, PracExam: {} });
      setOverrideGrades(savedResults.overrideGrades || {});
      setFinalGrades(savedResults.finalGrades || {});
      setSgpa(savedResults.sgpa || null);
    }
  }, []);

  useEffect(() => {
    if (module && discipline && semester) {
      setSubjects(subjectsData[module]?.[discipline]?.[semester] || {});
    } else {
      setSubjects({});
      setFinalGrades({});
      setOverrideGrades({});
      setSgpa(null);
    }
  }, [module, discipline, semester]);

  const handleInputChange = (event, examType, subject) => {
    const value = event.target.value === "" ? "" : Number(event.target.value);
    
    if (overrideGrades[subject]) {
      setOverrideGrades(prev => {
        const copy = { ...prev };
        delete copy[subject];
        return copy;
      });
    }

    setMarks((prevMarks) => ({
      ...prevMarks,
      [examType]: { ...prevMarks[examType], [subject]: value },
    }));
  };

  const handleGradeOverride = (subject, selectedGrade) => {
    setOverrideGrades(prev => ({ ...prev, [subject]: selectedGrade }));
  };

  const fillMaxMarks = () => {
    const maxMarks = { MidSemExam: {}, EndSemExam: {}, Quiz: {}, TeacherEval: {}, PracExam: {} };
    Object.keys(subjects).forEach((subject) => {
      maxMarks.MidSemExam[subject] = maxValues.MidSemExam;
      maxMarks.EndSemExam[subject] = maxValues.EndSemExam;
      maxMarks.Quiz[subject] = maxValues.Quiz;
      maxMarks.TeacherEval[subject] = maxValues.TeacherEval;
      if (subjects[subject]?.["grade-point"]?.split("-")[2] !== "0") {
        maxMarks.PracExam[subject] = maxValues.PracExam;
      }
    });
    setOverrideGrades({}); 
    setMarks(maxMarks);
  };

  const calculateFinalMarks = () => {
    const computedFinalMarks = {};
    Object.entries(subjects).forEach(([subject, details]) => {
      if (overrideGrades[subject]) {
        computedFinalMarks[subject] = overrideGrades[subject]; 
        return;
      }

      const [theoryWeight, pracWeight] = weightDistribution[details["grade-point"]] || [0, 0];
      const theoryMarks = (marks.MidSemExam[subject] || 0) + (marks.EndSemExam[subject] || 0) + (marks.Quiz[subject] || 0) + (marks.TeacherEval[subject] || 0);
      const totalTheoryMax = maxValues.MidSemExam + maxValues.EndSemExam + maxValues.Quiz + maxValues.TeacherEval;
      const normalizedTheoryMarks = totalTheoryMax > 0 ? (theoryMarks / totalTheoryMax) * 100 : 0;
      const pracMarks = marks.PracExam[subject] || 0;
      const normalizedPracMarks = maxValues.PracExam > 0 ? (pracMarks / maxValues.PracExam) * 100 : 0;
      
      const numericalScore = Math.round(((normalizedTheoryMarks * theoryWeight) / 100) + ((normalizedPracMarks * pracWeight) / 100));
      
      let computedGrade = "F";
      if (numericalScore >= 85) computedGrade = "S";
      else if (numericalScore >= 75) computedGrade = "A";
      else if (numericalScore >= 65) computedGrade = "B";
      else if (numericalScore >= 55) computedGrade = "C";
      else if (numericalScore >= 45) computedGrade = "D";
      else if (numericalScore >= 35) computedGrade = "E";

      computedFinalMarks[subject] = computedGrade;
    });

    setFinalGrades(computedFinalMarks);
  };

  useEffect(() => {
    if (Object.keys(finalGrades).length === 0) return;
    
    let totalEarnedPoints = 0;
    let totalSemesterCredits = 0;

    Object.entries(finalGrades).forEach(([subject, gradeOrScore]) => {
      const credit = subjects[subject]?.weight ?? 0;
      const finalLetter = typeof gradeOrScore === "string" ? gradeOrScore : "F";
      
      totalEarnedPoints += (gradesScale[finalLetter] ?? 0) * credit;
      totalSemesterCredits += credit;
    });

    const calculatedSGPA = totalSemesterCredits ? (totalEarnedPoints / totalSemesterCredits).toFixed(2) : "0.00";
    setSgpa(calculatedSGPA);
    
    localStorage.setItem("gradeResults", JSON.stringify({ 
      module, discipline, semester, marks, overrideGrades, finalGrades, sgpa: calculatedSGPA 
    }));
  }, [finalGrades, subjects, module, discipline, semester, marks, overrideGrades]);

  return (
    // Changed to p-0 container setup to let elements layout edge-to-edge
    <div className="min-vh-screen bg-light w-100 m-0 p-3 p-md-4">
      {/* Swap container wrapper for container-fluid to span 100% viewport width */}
      <div className="container-fluid w-100 m-0 p-0">
        
        {/* Full-Width Header */}
        <header className="card p-4 border-0 shadow-sm rounded-3 mb-4 bg-white w-100">
          <div className="row align-items-center justify-content-between g-3 m-0 w-100">
            <div className="col-auto p-0">
              <h1 className="h3 fw-bold text-primary mb-1">NERIST Smart Grade Portal</h1>
              <span className="text-secondary d-block fs-6">Precision Credit Weighting & Multi-Term Estimation Framework</span>
            </div>
            <div className="col-auto p-0">
              <a href="https://github.com/chkg2a/nerist-cgpa" target="_blank" rel="noreferrer" className="text-dark fs-2">
                <FaGithub />
              </a>
            </div>
          </div>
        </header>

        {/* Full-Width Filter Configuration Card */}
        <section className="card p-3 p-md-4 border-0 shadow-sm rounded-3 bg-white mb-4 w-100">
          <h2 className="h6 fw-bold text-dark text-uppercase mb-3 border-bottom pb-2 tracking-wide">Academic Frame Configuration</h2>
          <DisciplineSelector
            module={module} setModule={setModule}
            discipline={discipline} setDiscipline={setDiscipline}
            semester={semester} setSemester={setSemester}
            subjectsData={subjectsData}
          />
        </section>

        {/* Dynamic Structural Grid Workspace */}
        {module && discipline && semester ? (
          <div className="row g-4 m-0 w-100 row-cols-1 row-cols-xxl-2">
            {/* Left Evaluation Space - Scaled for 65% width representation on massive panels */}
            <div className="col-12 col-lg-7 col-xxl-8 p-0 pe-lg-3">
              <div className="card p-3 p-md-4 border-0 shadow-sm rounded-3 bg-white mb-4 w-100">
                <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4 gap-2">
                  <div>
                    <h3 className="h5 fw-bold text-dark mb-0 text-uppercase">Course Evaluation Matrix</h3>
                    <small className="text-muted">Enter marks or directly choose individual subject final grades.</small>
                  </div>
                  <button onClick={fillMaxMarks} className="btn btn-md btn-outline-secondary px-4 rounded-pill fw-bold">
                    Auto-Fill All Max Marks
                  </button>
                </div>
                
                <SubjectsList 
                  subjects={subjects} 
                  marks={marks} 
                  overrideGrades={overrideGrades}
                  handleInputChange={handleInputChange} 
                  handleGradeOverride={handleGradeOverride}
                />

                <button onClick={calculateFinalMarks} className="btn btn-primary w-100 py-3 fs-5 fw-bold rounded-3 shadow-sm mt-3">
                  Compile Active Semester Report
                </button>
              </div>
              
              {sgpa && <ResultsDisplay finalGrades={finalGrades} sgpa={sgpa} />}
            </div>

            {/* Right Side Predictor Panel - Formatted cleanly alongside work layouts */}
            <div className="col-12 col-lg-5 col-xxl-4 p-0">
              <CGPAPredictor 
                module={module}
                discipline={discipline}
                currentSemester={semester} 
                currentSGPA={sgpa} 
                subjectsData={subjectsData}
              />
            </div>
          </div>
        ) : (
          <div className="card p-5 text-center border-0 shadow-sm rounded-3 bg-white w-100">
            <div className="py-5">
              <h3 className="h4 fw-bold text-secondary mb-2">Awaiting Framework Parameters</h3>
              <p className="text-muted mb-0 mx-auto fs-6" style={{ maxWidth: "600px" }}>
                Please select your Academic Module, Discipline Branch, and tracking term Semester within the top section to display the configuration tables.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
