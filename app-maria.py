from flask import Flask, request, jsonify
from flask_cors import CORS
from data import Section, Remark_Manager, Student, Type_Manager
from functools import wraps
from data import Remark_Manager 
import random

# Init section
section = Section()


app = Flask(__name__)
CORS(app) 

# Debugging helper
def print_json_data(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        print(request.json)
        return f(*args, **kwargs)
    return wrapper

# Serialize student
def student_to_dict(student):
    return {
        "id": student.id,
        "first_name": student.first_name,
        "last_name": student.last_name,
        "grade": student.grade,
        "remark": student.remark
    }

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5500", "http://localhost:5500"]}})

@app.route('/get_major_student', methods=['POST'])
def get_major_student():
	return jsonify(student_to_dict(section.get_major_student()))

@app.route('/get_students', methods=['GET', 'POST'])
def get_students():
    
    if request.method == 'POST':
        data = request.json
        new_id = str(random.randint(10**11, 10**12 - 1))
        new_student = Student(
            id=new_id,
            first_name=data['first_name'],
            last_name=data['last_name'],
            grade=data['grade'],
            remark=data['remark']
        )
        
        section.add_student(new_student)
        return jsonify({
            'message': 'Student added successfully',
            'student': student_to_dict(new_student)
        }), 201

    return jsonify([student_to_dict(s) for s in section.get_students()])

@app.route('/search_students', methods=['POST'])
def search_students():
    data = request.json
    query = data.get('query', '').lower()
    only_good = data.get('only_good', False)
    remark_name = data.get('remark_name', None)

    students = section.get_students()
    results = []

    for s in students:
        if query and query not in s.first_name.lower() and query not in s.last_name.lower():
            continue
        if only_good and s.remark < 2:
            continue
        if remark_name is not None:
            remarks = Remark_Manager.get_remarks_str()
            if remarks[s.remark] != remark_name:
                continue
        results.append(student_to_dict(s))

    return jsonify(results)

@app.route('/init_students', methods=['POST'])
def init_students():
    section.static_init()
    return jsonify({'message': 'Section reset'}), 200

@app.route('/remove_student', methods=['DELETE'])
@print_json_data
def remove_student():
    data = request.json
    student_id = data.get("id")
    initial_count = len(section.students)
    section.students = [s for s in section.students if s.id != student_id]
    if len(section.students) < initial_count:
        section.save_students()
        return jsonify({"message": "Student deleted"}), 200
    else:
        return jsonify({"message": "Student not found"}), 404

@app.route('/get_remarks', methods=['POST'])
def get_remarks():
    return jsonify(Remark_Manager.get_remarks_str())



@app.route('/remove_passable_students', methods=['POST'])
def remove_passable_students():
    try:
        initial_count = len(section.students)

        # On force cast au cas où certains remarks seraient strings
        section.students = [
            s for s in section.students if int(s.remark) != Remark_Manager.PASSABLE
        ]

        final_count = len(section.students)

        if final_count < initial_count:
            section.save_students()
            return jsonify({"message": f"{initial_count - final_count} passable students removed"}), 200
        else:
            return jsonify({"message": "No passable students found"}), 200

    except Exception as e:
        print(" Error:", e)
        return jsonify({"error": str(e)}), 500






if __name__ == '__main__':
    app.run(debug=True)


