import React from "react";

const DisciplineSelector = ({
  module, setModule,
  discipline, setDiscipline,
  semester, setSemester,
  subjectsData,
}) => {
  const handleModuleChange = (e) => {
    setModule(e.target.value);
    setDiscipline("");
    setSemester("");
  };

  const handleDisciplineChange = (e) => {
    setDiscipline(e.target.value);
    setSemester("");
  };

  return (
    <div className="row row-cols-1 row-cols-md-3 g-3">
      <div>
        <label className="form-label small fw-bold text-secondary">Academic Module / Program</label>
        <select className="form-select border-secondary-subtle py-2" value={module} onChange={handleModuleChange}>
          <option value="">-- Choose Program (e.g. Degree) --</option>
          {Object.keys(subjectsData || {}).map((mod) => (
            <option key={mod} value={mod}>{mod}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label small fw-bold text-secondary">Discipline / Branch Study</label>
        <select className="form-select border-secondary-subtle py-2" value={discipline} onChange={handleDisciplineChange} disabled={!module}>
          <option value="">-- Select Branch Department --</option>
          {module && Object.keys(subjectsData[module] || {}).map((disc) => (
            <option key={disc} value={disc}>{disc}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label small fw-bold text-secondary">Active Term Semester</label>
        <select className="form-select border-secondary-subtle py-2" value={semester} onChange={(e) => setSemester(e.target.value)} disabled={!discipline}>
          <option value="">-- Select Active Semester --</option>
          {module && discipline && Object.keys(subjectsData[module]?.[discipline] || {}).map((sem) => (
            <option key={sem} value={sem}>Semester {sem}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DisciplineSelector;
