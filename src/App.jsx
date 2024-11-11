import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import subjectsData from "./subjects.json";
import DisciplineSelector from "./components/DisciplineSelector";
import SubjectsList from "./components/SubjectsList";
import ResultsDisplay from "./components/ResultsDisplay";
import { FaGithub } from "react-icons/fa6";
import { weightDistribution, gradesScale, maxValues } from "./utils/constants";

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
      const [theoryWeight, pracWeight] = weightDistribution[
        details["grade-point"]
      ] || [0, 0];

      const theoryMarks =
        (marks.MidSemExam[subject] || 0) +
        (marks.EndSemExam[subject] || 0) +
        (marks.Quiz[subject] || 0) +
        (marks.TeacherEval[subject] || 0);

      const totalTheoryMax =
        maxValues.MidSemExam +
        maxValues.EndSemExam +
        maxValues.Quiz +
        maxValues.TeacherEval;
      const normalizedTheoryMarks = (theoryMarks / totalTheoryMax) * 100;
      const pracMarks = marks.PracExam[subject] || 0;
      const normalizedPracMarks = (pracMarks / maxValues.PracExam) * 100;

      const theoryComponent = (normalizedTheoryMarks * theoryWeight) / 100;
      const pracComponent = (normalizedPracMarks * pracWeight) / 100;

      finalMarks[subject] = Math.round(theoryComponent + pracComponent);
    });

    setFinalGrades(finalMarks);
    calculateCGPA();
  };

  const calculateCGPA = () => {
    let totalPoints = 0,
      totalWeights = 0;

    Object.entries(finalGrades).forEach(([subject, mark]) => {
      const weight = subjects[subject]?.weight || 0;
      let grade;

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

    const calculatedCGPA = totalWeights
      ? (totalPoints / totalWeights).toFixed(2)
      : 0;
    setCgpa(calculatedCGPA);

    // Save results only if CGPA is valid
    if (calculatedCGPA) {
      saveResults(calculatedCGPA);
    }
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
    <div className="w-screen container mt-4">
      <h1 className="text-center">Grade Calculator</h1>
      <div className="flex justify-center items-center">
        <a
          href="https://github.com/chkg2a/nerist-cgpa"
          className="md:absolute top-10 right-10 text-black no-underline hover:text-black focus:text-black active:text-black text-6xl"
        >
          <FaGithub />
        </a>
      </div>
      <DisciplineSelector
        discipline={discipline}
        semester={semester}
        setDiscipline={setDiscipline}
        setSemester={setSemester}
        subjectsData={subjectsData}
      />
      <SubjectsList
        subjects={subjects}
        marks={marks}
        handleInputChange={handleInputChange}
      />
      <div className="mt-3">
        <button onClick={fillMaxMarks} className="btn btn-secondary mr-3">
          Max
        </button>
        <button onClick={calculateFinalMarks} className="btn btn-primary">
          Calculate
        </button>
      </div>
      {cgpa && <ResultsDisplay finalGrades={finalGrades} cgpa={cgpa} />}
    </div>
  );
};

export default App;
