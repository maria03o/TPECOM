import { request } from './request.js';


async function get_students() {
    const response = await fetch('http://127.0.0.1:5000/get_students');
    return await response.json();
}


async function deleteStudent(id) {
    await fetch('http://127.0.0.1:5000/remove_student', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    displayStudents(); // Refresh list
}

// Display students
function renderStudents(students) {
    const container = document.getElementById('student-container');
    container.innerHTML = '';

    students.forEach(student => {
        const div = document.createElement('div');
        div.classList.add('student');
        div.classList.add('student');
     div.innerHTML = `
    <button onclick="deleteStudent('${student.id}')">🗑️</button>
    <p><strong>${student.first_name} ${student.last_name}</strong></p>
    <p>Grade: ${student.grade}</p>
    <p class="remark-badge remark-${student.remark}">${student.remark}</p>
    `;

        container.appendChild(div);
    });
}

async function displayStudents() {
    const students = await get_students();
    renderStudents(students);
}

// Add student
async function addStudent(event) {
    event.preventDefault();

    const student = {
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
        grade: document.getElementById('grade').value,
        remark: document.getElementById('remark').value
    };

    await fetch('http://127.0.0.1:5000/get_students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
    });

    displayStudents();
    event.target.reset();
}

// 🔍 Search + Filter logic
async function searchStudents() {
    let students = await get_students();

    const nameSearch = document.getElementById('search').value.toLowerCase();
    const filterGood = document.getElementById('filter-good').checked;
    const selectedRemark = document.getElementById('remark-select').value;

    const filtered = students.filter(student => {
        const matchesName = `${student.first_name} ${student.last_name}`.toLowerCase().includes(nameSearch);
        const isGood = !filterGood || student.grade >= 10;
        const matchesRemark = !selectedRemark || student.remark == selectedRemark;

        return matchesName && isGood && matchesRemark;
    });

    renderStudents(filtered);
}

// Populate remark dropdown
async function populateRemarks() {
    const response = await fetch('http://127.0.0.1:5000/get_remarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
    const remarks = await response.json();
    const remarkSelect = document.getElementById('remark-select');

    remarks.forEach((remark, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = remark;
        remarkSelect.appendChild(option);
    });
}



// Event listeners
document.getElementById('add-student-form').addEventListener('submit', addStudent);
document.getElementById('search-button').addEventListener('click', searchStudents);
// Add this at the bottom of main.js
document.getElementById('remove-passable').addEventListener('click', deletePassableStudents);

async function deletePassableStudents() {
    try {
        const response = await fetch('http://127.0.0.1:5000/remove_passable_students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        alert(data.message || data.error);
        displayStudents();
    } catch (error) {
        console.error("🔥 JS Error:", error);
        alert("Failed to delete passable students.");
    }
}




window.deleteStudent = deleteStudent; // for global onclick
window.onload = () => {
    displayStudents();
    populateRemarks();
};
