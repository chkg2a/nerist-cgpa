import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import subjectsData from "./subjects.json";

const weightDistribution = {
  "2-0-2": [67, 33],
  "2-0-4": [50, 50],
  "3-0-2": [75, 25],
  "4-0-2": [80, 20],
  "3-1-2": [80, 20],
  "2-0-6": [40, 60],
  "1-0-4": [0, 100],
  "3-1-0": [100, 0],
  "3-0-4": [60, 40],
};

const gradesScale = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
  I: 0,
};

const maxValues = {
  MidSemExam: 30,
  EndSemExam: 50,
  Quiz: 10,
  TeacherEval: 10,
  PracExam: 50,
};

const App = () => {
  const [discipline, setDiscipline] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState({});
  const [marks, setMarks] = useState({
    MidSemExam: {},
    EndSemExam: {},
    Quiz: {},
    TeacherEval: {},
    PracExam: {},
  });
  const [finalGrades, setFinalGrades] = useState({});
  const [cgpa, setCgpa] = useState(null);

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem("gradeResults"));
    if (savedResults) {
      setDiscipline(savedResults.discipline);
      setSemester(savedResults.semester);
      setMarks(savedResults.marks);
      setFinalGrades(savedResults.finalGrades);
      setCgpa(savedResults.cgpa);
    }
  }, []);

  useEffect(() => {
    if (discipline && semester) {
      setSubjects(subjectsData[discipline]?.[semester] || {});
    }
  }, [discipline, semester]);

  const handleInputChange = (event, examType, subject) => {
    const value = Number(event.target.value);
    setMarks((prevMarks) => ({
      ...prevMarks,
      [examType]: { ...prevMarks[examType], [subject]: value },
    }));
  };

  const fillMaxMarks = () => {
    const maxMarks = {
      MidSemExam: {},
      EndSemExam: {},
      Quiz: {},
      TeacherEval: {},
      PracExam: {},
    };

    Object.keys(subjects).forEach((subject) => {
      maxMarks.MidSemExam[subject] = maxValues.MidSemExam;
      maxMarks.EndSemExam[subject] = maxValues.EndSemExam;
      maxMarks.Quiz[subject] = maxValues.Quiz;
      maxMarks.TeacherEval[subject] = maxValues.TeacherEval;
      if (subjects[subject]?.["grade-point"]?.split("-")[2] !== "0") {
        maxMarks.PracExam[subject] = maxValues.PracExam;
      }
    });

    setMarks(maxMarks);
  };

  const calculateFinalMarks = () => {
    const finalMarks = {};

    Object.entries(subjects).forEach(([subject, details]) => {
      if (!details) return; // Skip if subject details are undefined

      const [theoryWeight, pracWeight] = weightDistribution[
        details["grade-point"]
      ] || [0, 0];

      // Calculate theory marks: include MidSem Exam, EndSem Exam, Quiz, and Teacher Eval
      const theoryMarks =
        (marks.MidSemExam[subject] || 0) +
        (marks.EndSemExam[subject] || 0) +
        (marks.Quiz[subject] || 0) +
        (marks.TeacherEval[subject] || 0);

      // Normalize theory marks based on the max possible values
      const totalTheoryMax =
        maxValues.MidSemExam +
        maxValues.EndSemExam +
        maxValues.Quiz +
        maxValues.TeacherEval;
      const normalizedTheoryMarks = (theoryMarks / totalTheoryMax) * 100;

      // Calculate practical marks (if applicable)
      const pracMarks = marks.PracExam[subject] || 0;
      const normalizedPracMarks = (pracMarks / maxValues.PracExam) * 100;

      // Final component calculation
      const theoryComponent = (normalizedTheoryMarks * theoryWeight) / 100;
      const pracComponent = (normalizedPracMarks * pracWeight) / 100;

      finalMarks[subject] = Math.round(theoryComponent + pracComponent);
    });

    setFinalGrades(finalMarks);
  };

  useEffect(() => {
    if (Object.keys(finalGrades).length > 0) {
      calculateCGPA();
    }
  }, [finalGrades]);

  const calculateCGPA = () => {
    let totalPoints = 0,
      totalWeights = 0;

    Object.entries(finalGrades).forEach(([subject, mark]) => {
      const [theoryWeight, pracWeight] = weightDistribution[
        subjects[subject]?.["grade-point"]
      ] || [0, 0];
      const weight = subjects[subject]?.weight || 0;
      let grade;

      // Determine the grade based on the final marks
      if (mark > 83) grade = "S";
      else if (mark > 73) grade = "A";
      else if (mark > 63) grade = "B";
      else if (mark > 53) grade = "C";
      else if (mark > 43) grade = "D";
      else if (mark > 33) grade = "E";
      else grade = "F";

      totalPoints += gradesScale[grade] * weight;
      totalWeights += weight;
    });

    // Calculate CGPA based on total points and total weight
    const calculatedCGPA = (totalPoints / totalWeights).toFixed(2);
    setCgpa(calculatedCGPA);
    saveResults(calculatedCGPA);
  };

  const saveResults = (calculatedCGPA) => {
    const results = {
      discipline,
      semester,
      marks,
      finalGrades,
      cgpa: calculatedCGPA,
    };
    localStorage.setItem("gradeResults", JSON.stringify(results));
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Grade Calculator</h1>
      <div className="mb-3">
        <label>Discipline</label>
        <select
          className="form-control"
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
        >
          <option value="">Select Discipline</option>
          {Object.keys(subjectsData).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label>Semester</label>
        <select
          className="form-control"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">Select Semester</option>
          {Object.keys(subjectsData[discipline] || {}).map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        {Object.keys(subjects).map((subject) => (
          <div key={subject} className="col-md-4 mb-3">
            <h5>{subject}</h5>
            <input
              type="number"
              placeholder="MidSem Exam"
              min="0"
              max="30"
              value={marks.MidSemExam[subject] || ""}
              onChange={(e) => handleInputChange(e, "MidSemExam", subject)}
              className="form-control mb-2"
            />
            <input
              type="number"
              placeholder="EndSem Exam"
              min="0"
              max="50"
              value={marks.EndSemExam[subject] || ""}
              onChange={(e) => handleInputChange(e, "EndSemExam", subject)}
              className="form-control mb-2"
            />
            <input
              type="number"
              placeholder="Quiz"
              min="0"
              max="10"
              value={marks.Quiz[subject] || ""}
              onChange={(e) => handleInputChange(e, "Quiz", subject)}
              className="form-control mb-2"
            />
            <input
              type="number"
              placeholder="Teacher Eval"
              min="0"
              max="10"
              value={marks.TeacherEval[subject] || ""}
              onChange={(e) => handleInputChange(e, "TeacherEval", subject)}
              className="form-control mb-2"
            />
            {subjects[subject]?.["grade-point"]?.split("-")[2] !== "0" && (
              <input
                type="number"
                placeholder="Practical Exam"
                min="0"
                max="50"
                value={marks.PracExam[subject] || ""}
                onChange={(e) => handleInputChange(e, "PracExam", subject)}
                className="form-control mb-2"
              />
            )}
          </div>
        ))}
      </div>

      <button onClick={fillMaxMarks} className="btn btn-secondary mr-3">
        Max
      </button>
      <button onClick={calculateFinalMarks} className="btn btn-primary">
        Calculate
      </button>
      {cgpa && (
        <div className="mt-4">
          <h2>Results</h2>
          {Object.entries(finalGrades).map(([subject, mark]) => {
            let grade;
            let gradeColor;

            // Calculate grade based on marks
            if (mark > 83) {
              grade = "S";
              gradeColor = "gold"; // Gold for 'S'
            } else if (mark > 73) {
              grade = "A";
              gradeColor = "blue"; // Blue for 'A'
            } else if (mark > 63) {
              grade = "B";
              gradeColor = "green"; // Green for 'B'
            } else if (mark > 53) {
              grade = "C";
              gradeColor = "orange"; // Orange for 'C'
            } else if (mark > 43) {
              grade = "D";
              gradeColor = "yellow"; // Yellow for 'D'
            } else if (mark > 33) {
              grade = "E";
              gradeColor = "purple"; // Purple for 'E'
            } else {
              grade = "F";
              gradeColor = "red"; // Red for 'F'
            }

            return (
              <p key={subject}>
                {subject}: {mark}{" "}
                <span style={{ color: gradeColor }}>(Grade: {grade})</span>
              </p>
            );
          })}
          <h4>CGPA: {cgpa}</h4>
          <h4>Percentage: {(cgpa * 10 - 5).toFixed(2)}%</h4>
        </div>
      )}
    </div>
  );
};

export default App;
