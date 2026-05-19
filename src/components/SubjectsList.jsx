import React from "react";
import SubjectInput from "./SubjectInput";

const SubjectsList = ({ subjects, marks, overrideGrades, handleInputChange, handleGradeOverride }) => (
  <div className="d-flex flex-column">
    {Object.keys(subjects).map((subject) => (
      <SubjectInput
        key={subject}
        subject={subject}
        marks={marks}
        overrideGrades={overrideGrades}
        handleInputChange={handleInputChange}
        handleGradeOverride={handleGradeOverride}
        weight={subjects[subject]?.["weight"]}
        gradePoint={subjects[subject]?.["grade-point"]}
      />
    ))}
  </div>
);

export default SubjectsList;
