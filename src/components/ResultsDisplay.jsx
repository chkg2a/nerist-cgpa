const ResultsDisplay = ({ finalGrades, cgpa }) => (
  <div className="mt-4">
    <h2>Results</h2>
    {Object.entries(finalGrades).map(([subject, mark]) => {
      let grade;
      if (mark > 83) grade = "S";
      else if (mark > 73) grade = "A";
      else if (mark > 63) grade = "B";
      else if (mark > 53) grade = "C";
      else if (mark > 43) grade = "D";
      else if (mark > 33) grade = "E";
      else grade = "F";

      return (
        <p key={subject}>
          {subject}: {mark} ({grade})
        </p>
      );
    })}
    <h4>SGPA: {cgpa}</h4>
    <h4>Percentage: {(cgpa * 10 - 5).toFixed(2)}%</h4>
  </div>
);

export default ResultsDisplay;
