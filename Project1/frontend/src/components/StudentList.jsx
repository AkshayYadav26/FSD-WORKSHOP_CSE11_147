function StudentList({
  students,
  searchTerm,
  loading,
  loadError,
  onEdit,
  onDelete,
  onRetry,
}) {
  // Filter students by ID or name (name search is case-insensitive)
  const query = searchTerm.trim().toLowerCase();
  const filteredStudents = students.filter((student) => {
    if (!query) return true;
    const idMatch = String(student.id).includes(query);
    const nameMatch = student.name.toLowerCase().includes(query);
    return idMatch || nameMatch;
  });

  // Loading state while data is being fetched
  if (loading) {
    return <p className="table-message">Loading students...</p>;
  }

  // Backend is not reachable
  if (loadError) {
    return (
      <div className="table-message">
        <p>Could not load students. Please make sure the backend server is running.</p>
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Try Again
        </button>
      </div>
    );
  }

  // Empty state: no students added yet
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">🎓</p>
        <p>No students yet. Add your first student using the form.</p>
      </div>
    );
  }

  // Search gave no results
  if (filteredStudents.length === 0) {
    return <p className="table-message">No student found</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Branch</th>
            <th>Semester</th>
            <th>Mobile Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.branch}</td>
              <td>{student.semester}</td>
              <td>{student.mobile}</td>
              <td>
                <div className="action-buttons">
                  <button
                    type="button"
                    className="btn btn-edit"
                    onClick={() => onEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-delete"
                    onClick={() => onDelete(student)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
