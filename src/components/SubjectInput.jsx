const SubjectInput = ({
  subject,
  marks,
  weight,
  handleInputChange,
  gradePoint,
}) => (
  <div>
    <h2 className="font-semibold text-xl">
      {subject} - {weight} - ({gradePoint})
    </h2>
    <div className="flex text-sm items-center gap-2">
      <input
        type="number"
        placeholder="MidSem Exam"
        min="0"
        max="30"
        value={marks.MidSemExam[subject] || ""}
        onChange={(e) => handleInputChange(e, "MidSemExam", subject)}
        className="form-control mb-2"
      />
      <p className="text-gray-400">/30</p>
    </div>
    <div className="flex text-sm items-center gap-2">
      <input
        type="number"
        placeholder="EndSem Exam"
        min="0"
        max="50"
        value={marks.EndSemExam[subject] || ""}
        onChange={(e) => handleInputChange(e, "EndSemExam", subject)}
        className="form-control mb-2"
      />
      <p className="text-gray-400">/50</p>
    </div>
    <div className="flex text-sm items-center gap-2">
      <input
        type="number"
        placeholder="Quiz"
        min="0"
        max="10"
        value={marks.Quiz[subject] || ""}
        onChange={(e) => handleInputChange(e, "Quiz", subject)}
        className="form-control mb-2"
      />
      <p className="text-gray-400">/10</p>
    </div>
    <div className="flex text-sm items-center gap-2">
      <input
        type="number"
        placeholder="Teacher Eval"
        min="0"
        max="10"
        value={marks.TeacherEval[subject] || ""}
        onChange={(e) => handleInputChange(e, "TeacherEval", subject)}
        className="form-control mb-2"
      />
      <p className="text-gray-400">/10</p>
    </div>
    {gradePoint?.split("-")[2] !== "0" && (
      <div className="flex text-sm items-center gap-2">
        <input
          type="number"
          placeholder="Practical Exam"
          min="0"
          max="50"
          value={marks.PracExam[subject] || ""}
          onChange={(e) => handleInputChange(e, "PracExam", subject)}
          className="form-control mb-2"
        />
      <p className="text-gray-400">/50</p>
      </div>
    )}
  </div>
);

export default SubjectInput;
