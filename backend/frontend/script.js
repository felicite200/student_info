const API_URL = "https://student-info-hoj2.onrender.com/students"; // We'll update this URL later

// Elements
const studentForm = document.getElementById("student-form");
const studentIdInput = document.getElementById("student-id");
const studentNameInput = document.getElementById("student-name");
const studentLevelInput = document.getElementById("student-level");
const studentsBody = document.getElementById("students-body");

// Load students on page load
window.onload = fetchStudents;

function fetchStudents() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      studentsBody.innerHTML = "";
      data.forEach((student) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
    <td>${student.id}</td>
    <td>${student.name}</td>
    <td>${student.RegNumber}</td>
    <td>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </td>
  `;
        // Add event listeners
        tr.querySelector(".edit-btn").addEventListener("click", () => {
          editStudent(student.id, student.name, student.RegNumber);
        });
        tr.querySelector(".delete-btn").addEventListener("click", () => {
          deleteStudent(student.id);
        });
        studentsBody.appendChild(tr);
      });
    })
    .catch((err) => alert("Error loading students: " + err));
}

// Add or Update student
studentForm.onsubmit = function (e) {
  e.preventDefault();
  const id = studentIdInput.value;
  const name = studentNameInput.value.trim();
  const RegNumber = studentLevelInput.value.trim();

  if (!name || !RegNumber) {
    alert("Please fill in all fields");
    return;
  }

  if (id) {
    // Update student (PUT)
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, RegNumber }),
    })
      .then((res) => res.json())
      .then(() => {
        resetForm();
        fetchStudents();
      })
      .catch((err) => alert("Update failed: " + err));
  } else {
    // Create student (POST)
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, RegNumber }),
    })
      .then((res) => res.json())
      .then(() => {
        resetForm();
        fetchStudents();
      })
      .catch((err) => alert("Create failed: " + err));
  }
};

// Fill form for editing
function editStudent(id, name, RegNumber) {
  studentIdInput.value = id;
  studentNameInput.value = name;
  studentLevelInput.value = RegNumber;
}

// Delete student
function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => fetchStudents())
      .catch((err) => alert("Delete failed: " + err));
  }
}

function resetForm() {
  studentIdInput.value = "";
  studentNameInput.value = "";
  studentLevelInput.value = "";
}
