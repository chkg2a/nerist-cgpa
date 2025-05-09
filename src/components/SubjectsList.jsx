import React from "react";
import SubjectInput from "./SubjectInput";

const SubjectsList = ({ subjects, marks, handleInputChange }) => (
  <div className="row">
    {Object.keys(subjects).map((subject) => (
      <div key={subject} className="col-md-4 mb-3">
        <SubjectInput
          subject={subject}
          marks={marks}
          handleInputChange={handleInputChange}
          weight={subjects[subject]?.["weight"]}
          gradePoint={subjects[subject]?.["grade-point"]}
        />
      </div>
    ))}
  </div>
);

export default SubjectsList;
