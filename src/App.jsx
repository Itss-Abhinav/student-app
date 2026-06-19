import { useState, useEffect } from 'react';
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from './studentService';

export default function App() {

  const [students, setStudents]      = useState([]);
  const [search,   setSearch]        = useState('');
  const [showForm, setShowForm]      = useState(false);
  const [editing,  setEditing]       = useState(null);
  const [form,     setForm]          = useState({ name:'', email:'', course:'', age:'' });
  const [loading,  setLoading]       = useState(true);
  const [error,    setError]         = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  function loadStudents() {
    setLoading(true);
    getAllStudents()
      .then(res  => { setStudents(res.data); setLoading(false); })
      .catch(()  => { setError('Cannot connect to Spring Boot. Is it running on port 8080?'); setLoading(false); });
  }

  function openAddForm() {
    setEditing(null);
    setForm({ name:'', email:'', course:'', age:'' });
    setShowForm(true);
  }

  function openEditForm(student) {
    setEditing(student);
    setForm({ name: student.name, email: student.email, course: student.course, age: student.age });
    setShowForm(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editing) {
      await updateStudent(editing.id, form);
    } else {
      await createStudent(form);
    }
    setShowForm(false);
    loadStudents();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this student?')) return;
    await deleteStudent(id);
    setStudents(students.filter(s => s.id !== id));
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>

      <h1 style={styles.heading}>🎓 Student Management</h1>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.topBar}>
        <input
          style={styles.searchInput}
          placeholder="🔍 Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button style={styles.addBtn} onClick={openAddForm}>
          + Add Student
        </button>
      </div>

      {showForm && (
        <div style={styles.formBox}>
          <h3 style={{ margin:'0 0 16px' }}>
            {editing ? '✏️ Edit Student' : '➕ Add New Student'}
          </h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              name="course"
              placeholder="Course (e.g. CSE)"
              value={form.course}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              name="age"
              type="number"
              placeholder="Age (e.g. 20)"
              value={form.age}
              onChange={handleChange}
              required
            />
            <div style={{ display:'flex', gap:10 }}>
              <button type="submit" style={styles.saveBtn}>
                💾 Save
              </button>
              <button type="button" style={styles.cancelBtn} onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign:'center', color:'#888', marginTop:40 }}>Loading students...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={{ background:'#f1f5f9' }}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Course</th>
              <th style={styles.th}>Age</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign:'center', padding:32, color:'#aaa' }}>
                  {search ? 'No students match your search.' : 'No students yet. Add one!'}
                </td>
              </tr>
            ) : (
              filtered.map(student => (
                <tr key={student.id} style={styles.row}>
                  <td style={styles.td}>{student.id}</td>
                  <td style={styles.td}><strong>{student.name}</strong></td>
                  <td style={styles.td}>{student.email}</td>
                  <td style={styles.td}>{student.course}</td>
                  <td style={styles.td}>{student.age}</td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => openEditForm(student)}>
                      ✏️ Edit
                    </button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(student.id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {!loading && (
        <p style={{ marginTop:16, color:'#888', fontSize:13 }}>
          Showing {filtered.length} of {students.length} students
        </p>
      )}
    </div>
  );
}

const styles = {
  page:        { maxWidth:900, margin:'40px auto', padding:'0 24px', fontFamily:'Inter, sans-serif' },
  heading:     { fontSize:28, fontWeight:700, marginBottom:24, color:'#1e293b' },
  error:       { background:'#fee2e2', color:'#991b1b', padding:'12px 16px', borderRadius:8, marginBottom:16 },
  topBar:      { display:'flex', gap:12, marginBottom:20 },
  searchInput: { flex:1, padding:'10px 14px', fontSize:14, border:'1px solid #cbd5e1', borderRadius:8, outline:'none' },
  addBtn:      { padding:'10px 20px', background:'#2563eb', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600, fontSize:14 },
  formBox:     { background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:24, marginBottom:24 },
  form:        { display:'flex', flexDirection:'column', gap:12 },
  input:       { padding:'10px 14px', fontSize:14, border:'1px solid #cbd5e1', borderRadius:8, outline:'none' },
  saveBtn:     { flex:1, padding:'10px', background:'#16a34a', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 },
  cancelBtn:   { flex:1, padding:'10px', background:'#6b7280', color:'#fff', border:'none', borderRadius:8, cursor:'pointer' },
  table:       { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:12, overflow:'hidden', border:'1px solid #e2e8f0' },
  th:          { padding:'12px 16px', textAlign:'left', fontWeight:600, fontSize:13, color:'#475569', borderBottom:'2px solid #e2e8f0' },
  td:          { padding:'12px 16px', fontSize:14, color:'#1e293b' },
  row:         { borderBottom:'1px solid #f1f5f9' },
  editBtn:     { marginRight:8, padding:'5px 12px', background:'#f59e0b', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontSize:13 },
  deleteBtn:   { padding:'5px 12px', background:'#ef4444', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontSize:13 },
};