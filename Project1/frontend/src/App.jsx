import { useEffect, useState } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import SearchStudent from './components/SearchStudent';
import './App.css';

// Base URL of the backend API (make sure the backend is running on port 5000)
const API_URL = 'http://localhost:5000/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null); // student currently being edited
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', text }
  const [loading, setLoading] = useState(true); // students load on startup, so we start in loading state
  const [loadError, setLoadError] = useState(false);

  // Shows a success/error notification that disappears after 4 seconds
  const showMessage = (type, text) => setNotification({ type, text });

  // Builds a readable error message from a backend error response
  const getErrorMessage = (result) => {
    if (result.errors && result.errors.length > 0) {
      return `${result.message} ${result.errors.join(' ')}`;
    }
    return result.message || 'Something went wrong. Please try again.';
  };

  // ---------- Load all students from the backend ----------
  // Note: `loading` starts as true, so there is no need to set it here.
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setStudents(result.data);
      setLoadError(false);
    } catch {
      // fetch only throws when it cannot reach the server at all
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  // Used by the "Try Again" button shown when the backend is unreachable
  const retryFetch = () => {
    setLoading(true);
    fetchStudents();
  };

  useEffect(() => {
    // Load the student list once when the app starts.
    // All setState calls inside fetchStudents happen asynchronously (after await),
    // but the lint rule cannot detect that through the function call.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();
  }, []);

  // Auto-hide the notification after 4 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  // ---------- ADD a new student ----------
  const addStudent = async (studentData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      const result = await response.json();

      if (!response.ok) {
        showMessage('error', getErrorMessage(result));
        return false; // save failed
      }

      setStudents((prevStudents) => [...prevStudents, result.data]);
      showMessage('success', result.message);
      return true; // save succeeded
    } catch {
      showMessage('error', 'Could not connect to the server. Is the backend running?');
      return false;
    }
  };

  // ---------- UPDATE an existing student ----------
  const updateStudent = async (studentData) => {
    try {
      const response = await fetch(`${API_URL}/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      const result = await response.json();

      if (!response.ok) {
        showMessage('error', getErrorMessage(result));
        return false;
      }

      // Replace the old student with the updated one in the list
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === result.data.id ? result.data : student
        )
      );
      setEditingStudent(null); // back to "Add" mode
      showMessage('success', result.message);
      return true;
    } catch {
      showMessage('error', 'Could not connect to the server. Is the backend running?');
      return false;
    }
  };

  // The form calls the right function depending on the mode
  const handleSave = editingStudent ? updateStudent : addStudent;

  // ---------- DELETE a student (after confirmation) ----------
  const deleteStudent = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${student.name}" (ID: ${student.id})? This cannot be undone.`
    );
    if (!confirmed) return; // user clicked Cancel -> do nothing

    try {
      const response = await fetch(`${API_URL}/${student.id}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok) {
        showMessage('error', getErrorMessage(result));
        return;
      }

      // Remove the student from the list without reloading the page
      setStudents((prevStudents) =>
        prevStudents.filter((s) => s.id !== student.id)
      );

      // If the deleted student was being edited, close the edit form
      if (editingStudent && editingStudent.id === student.id) {
        setEditingStudent(null);
      }

      showMessage('success', result.message);
    } catch {
      showMessage('error', 'Could not connect to the server. Is the backend running?');
    }
  };

  // Put a student's data into the form for editing
  const startEdit = (student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear the form and go back to "Add" mode
  const cancelEdit = () => setEditingStudent(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Student Management System</h1>
        <p>Add, view, search, update and delete student records</p>
      </header>

      {notification && (
        <div
          className={`notification ${
            notification.type === 'success'
              ? 'notification-success'
              : 'notification-error'
          }`}
          role="alert"
        >
          {notification.text}
        </div>
      )}

      <main className="app-main">
        <section className="panel panel-form">
          {/* The key makes React rebuild the form whenever we switch
              between "Add" mode and editing a (different) student, so
              the form always starts with the right values. */}
          <StudentForm
            key={editingStudent ? `edit-${editingStudent.id}` : 'add'}
            editingStudent={editingStudent}
            onSave={handleSave}
            onCancelEdit={cancelEdit}
          />
        </section>

        <section className="panel panel-list">
          <div className="list-header">
            <h2>Student Records</h2>
            <SearchStudent searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <StudentList
            students={students}
            searchTerm={searchTerm}
            loading={loading}
            loadError={loadError}
            onEdit={startEdit}
            onDelete={deleteStudent}
            onRetry={retryFetch}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>
          B.Tech Mini Project &middot; Students are stored in memory, so records
          reset when the backend restarts.
        </p>
      </footer>
    </div>
  );
}

export default App;
