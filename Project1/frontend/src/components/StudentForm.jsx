import { useState } from 'react';

const BRANCHES = ['CSE', 'CS', 'IT', 'ECE'];

// Empty form values used to reset the form
const EMPTY_FORM = {
  id: '',
  name: '',
  email: '',
  branch: '',
  semester: '',
  mobile: '',
};

function StudentForm({ editingStudent, onSave, onCancelEdit }) {
  const isEditing = Boolean(editingStudent);

  // Initial form values: if a student was passed in, we are in "edit" mode
  // and the form starts filled with that student's data.
  const [form, setForm] = useState(() =>
    editingStudent
      ? {
          id: String(editingStudent.id),
          name: editingStudent.name,
          email: editingStudent.email,
          branch: editingStudent.branch,
          semester: String(editingStudent.semester),
          mobile: editingStudent.mobile,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  // One generic change handler for all inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Client-side validation: returns an object like { email: '...' }
  // (empty object means the form is valid)
  const validateForm = () => {
    const newErrors = {};

    if (!form.id.trim()) {
      newErrors.id = 'Student ID is required.';
    } else if (!/^\d+$/.test(form.id.trim()) || Number(form.id) <= 0) {
      newErrors.id = 'Student ID must be a positive number.';
    }

    if (!form.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Email must have a valid format.';
    }

    if (!form.branch) {
      newErrors.branch = 'Please select a branch.';
    }

    if (!form.semester) {
      newErrors.semester = 'Semester is required.';
    } else if (
      !Number.isInteger(Number(form.semester)) ||
      Number(form.semester) < 1 ||
      Number(form.semester) > 8
    ) {
      newErrors.semester = 'Semester must be between 1 and 8.';
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(form.mobile.trim())) {
      newErrors.mobile = 'Mobile number must contain exactly 10 digits.';
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // stop the page from reloading

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const studentData = {
      id: Number(form.id),
      name: form.name.trim(),
      email: form.email.trim(),
      branch: form.branch,
      semester: Number(form.semester),
      mobile: form.mobile.trim(),
    };

    // onSave resolves with true only when the backend accepts the student,
    // so the form is cleared only after a successful save.
    Promise.resolve(onSave(studentData)).then((saved) => {
      if (saved) setForm(EMPTY_FORM);
    });
  };

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditing ? 'Update Student' : 'Add Student'}</h2>

      <div className="form-group">
        <label htmlFor="id">Student ID</label>
        <input
          id="id"
          name="id"
          type="number"
          placeholder="e.g. 101"
          value={form.id}
          onChange={handleChange}
          disabled={isEditing}
          className={errors.id ? 'input-error' : ''}
        />
        {errors.id && <span className="field-error">{errors.id}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Rahul Sharma"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="e.g. rahul@gmail.com"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="branch">Branch</label>
        <select
          id="branch"
          name="branch"
          value={form.branch}
          onChange={handleChange}
          className={errors.branch ? 'input-error' : ''}
        >
          <option value="">Select branch</option>
          {BRANCHES.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        {errors.branch && <span className="field-error">{errors.branch}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="semester">Semester</label>
        <input
          id="semester"
          name="semester"
          type="number"
          min="1"
          max="8"
          placeholder="1 to 8"
          value={form.semester}
          onChange={handleChange}
          className={errors.semester ? 'input-error' : ''}
        />
        {errors.semester && <span className="field-error">{errors.semester}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="mobile">Mobile Number</label>
        <input
          id="mobile"
          name="mobile"
          type="text"
          placeholder="10-digit mobile number"
          value={form.mobile}
          onChange={handleChange}
          className={errors.mobile ? 'input-error' : ''}
        />
        {errors.mobile && <span className="field-error">{errors.mobile}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Student' : 'Add Student'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default StudentForm;
