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



# functions

def get_students():
	return [student_to_dict(s) for s in section.get_students()]






# views

@app.route('/get_remarks', methods=['POST'])
def get_remarks_view():
	return jsonify(Remark_Manager.get_remarks_str())

@app.route('/get_major_student', methods=['POST'])
def get_major_student_view():
	return jsonify(student_to_dict(section.get_major_student()))

@app.route('/get_students', methods=['POST'])
def get_students_view():
	print("get students")
	return jsonify(get_students())

@app.route('/init_students', methods=['POST'])
def init_students_view():
	print("init student")
	section.static_init()
	return jsonify(get_students())

@app.route("/test", methods=['POST'])
def test_view():
	print('test view')
	return {}

@app.route('/remove_students', methods=['POST'])
def remove_student_view():
	data = request.json
	type = data['type']
	value = data['value']
	print(type, value)
	section.remove_students_by(type, value)
	return jsonify(get_students())

@app.route('/search_students', methods=['POST'])
def search_students_view():
	data = request.json
	type = data['type']
	value = data['value']
	return jsonify([student_to_dict(s) for s in section.search_students(type, value)])
	


if __name__ == '__main__':
	app.run(debug=True)
