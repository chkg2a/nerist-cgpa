const DisciplineSelector = ({
  discipline,
  semester,
  setDiscipline,
  setSemester,
  subjectsData,
}) => (
  <div>
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
  </div>
);

export default DisciplineSelector;
