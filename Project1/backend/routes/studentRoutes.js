const express = require('express');
const router = express.Router();

// ---------- In-memory "database" ----------
// Students are stored in a plain JavaScript array.
// NOTE: All data resets when the server restarts (no database is used, as required).
let students = [
  { id: 101, name: 'Rahul Sharma', email: 'rahul@gmail.com', branch: 'CSE', semester: 3, mobile: '9876543210' },
  { id: 102, name: 'Priya Singh', email: 'priya.singh@gmail.com', branch: 'IT', semester: 5, mobile: '9123456780' },
  { id: 103, name: 'Aman Verma', email: 'aman.verma@gmail.com', branch: 'ECE', semester: 1, mobile: '9988776655' },
];

const VALID_BRANCHES = ['CSE', 'CS', 'IT', 'ECE'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Checks one student object and returns an array of error messages.
// An empty array means the student is valid.
function validateStudent(student) {
  const errors = [];

  // Student ID: required, must be a positive whole number
  const id = Number(student.id);
  if (student.id === undefined || student.id === null || student.id === '' ||
      !Number.isInteger(id) || id <= 0) {
    errors.push('Student ID is required and must be a positive number.');
  }

  // Name: required
  if (!student.name || String(student.name).trim() === '') {
    errors.push('Name is required.');
  }

  // Email: required and must have a valid format
  if (!student.email || String(student.email).trim() === '') {
    errors.push('Email is required.');
  } else if (!EMAIL_REGEX.test(String(student.email).trim())) {
    errors.push('Email must have a valid email format.');
  }

  // Branch: must be one of the allowed values
  if (!VALID_BRANCHES.includes(student.branch)) {
    errors.push('Branch must be one of: CSE, CS, IT, ECE.');
  }

  // Semester: must be a whole number between 1 and 8
  const semester = Number(student.semester);
  if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
    errors.push('Semester must be a number between 1 and 8.');
  }

  // Mobile: must contain exactly 10 digits
  if (!/^\d{10}$/.test(String(student.mobile || ''))) {
    errors.push('Mobile number must contain exactly 10 digits.');
  }

  return errors;
}

// ---------- GET /api/students  -> get all students ----------
router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: students });
});

// ---------- GET /api/students/:id  -> get one student ----------
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${req.params.id} not found.`,
    });
  }

  res.status(200).json({ success: true, data: student });
});

// ---------- POST /api/students  -> add a new student ----------
router.post('/', (req, res) => {
  const errors = validateStudent(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed.', errors });
  }

  const id = Number(req.body.id);

  // Student ID must be unique
  if (students.some((s) => s.id === id)) {
    return res.status(409).json({
      success: false,
      message: `Student ID ${id} already exists. Please use a unique ID.`,
    });
  }

  const newStudent = {
    id: id,
    name: String(req.body.name).trim(),
    email: String(req.body.email).trim(),
    branch: req.body.branch,
    semester: Number(req.body.semester),
    mobile: String(req.body.mobile).trim(),
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: 'Student added successfully.',
    data: newStudent,
  });
});

// ---------- PUT /api/students/:id  -> update an existing student ----------
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existingStudent = students.find((s) => s.id === id);

  if (!existingStudent) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${req.params.id} not found.`,
    });
  }

  // The ID in the URL is the final ID (the frontend does not allow changing it)
  const updatedData = { ...req.body, id: id };

  const errors = validateStudent(updatedData);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed.', errors });
  }

  Object.assign(existingStudent, {
    name: String(updatedData.name).trim(),
    email: String(updatedData.email).trim(),
    branch: updatedData.branch,
    semester: Number(updatedData.semester),
    mobile: String(updatedData.mobile).trim(),
  });

  res.status(200).json({
    success: true,
    message: 'Student updated successfully.',
    data: existingStudent,
  });
});

// ---------- DELETE /api/students/:id  -> delete a student ----------
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${req.params.id} not found.`,
    });
  }

  students.splice(index, 1);

  res.status(200).json({
    success: true,
    message: `Student with ID ${id} deleted successfully.`,
  });
});

module.exports = router;
