const SubjectInput = ({ subject, marks, handleInputChange, gradePoint }) => (
  <div>
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
    {gradePoint?.split("-")[2] !== "0" && (
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
);

export default SubjectInput;
