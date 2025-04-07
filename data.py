import json
import os

DATA_FILE = "students_data.json"

class Remark_Manager:
    PASSABLE = 0
    NEEDS_IMPROVEMENT = 1
    GOOD = 2
    EXCELLENT = 3

    @staticmethod
    def get_remarks_str():
        return ["Passable", "Needs Improvement", "Good", "Excellent"]

class Type_Manager:
    FIRST_NAME = 0
    LAST_NAME = 1
    GRADE = 2
    REMARK = 3


"""lajout dans student 2fnct 
 et section i guess nzid ta3 lbutton delete passeble suddent bch ytsavaw """
class Student:
    def __init__(self, id, first_name, last_name, grade, remark):
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.grade = grade
        self.remark = remark

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "grade": self.grade,
            "remark": self.remark
        }

    @staticmethod
    def from_dict(data):
        return Student(
            id=data['id'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            grade=data['grade'],
            remark=data['remark']
        )

class Section:
    def __init__(self):
        self.students = []
        self.load_students()

    def load_students(self):
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r") as f:
                data = json.load(f)
                self.students = [Student.from_dict(s) for s in data]
        else:
            self.static_init()

    def save_students(self):
        with open(DATA_FILE, "w") as f:
            json.dump([s.to_dict() for s in self.students], f, indent=2)

    def static_init(self):
        self.students = [
            Student("123456789012", "Alice", "Johnson", 18, Remark_Manager.EXCELLENT),
            Student("234567890123", "Bob", "Smith", 12, Remark_Manager.PASSABLE),
            Student("345678901234", "Charlie", "Brown", 15, Remark_Manager.GOOD),
            Student("456789012345", "David", "Wilson", 8, Remark_Manager.NEEDS_IMPROVEMENT),
            Student("567890123456", "Emma", "Davis", 20, Remark_Manager.EXCELLENT),
            Student("678901234567", "Frank", "Thomas", 5, Remark_Manager.NEEDS_IMPROVEMENT),
            Student("789012345678", "Grace", "White", 14, Remark_Manager.GOOD),
            Student("890123456789", "Henry", "Lewis", 10, Remark_Manager.PASSABLE),
            Student("901234567890", "Ivy", "Harris", 17, Remark_Manager.EXCELLENT),
            Student("012345678901", "Jack", "Martinez", 6, Remark_Manager.NEEDS_IMPROVEMENT),
        ]
        self.save_students()

    def get_students(self):
        return self.students
 
    def get_good_students(self):
        return [s for s in self.students if s.remark >= Remark_Manager.GOOD]

    def remove_all_students_by(self, type, value):
        if type == Type_Manager.FIRST_NAME:
            self.students = [s for s in self.students if s.first_name != value]
        elif type == Type_Manager.LAST_NAME:
            self.students = [s for s in self.students if s.last_name != value]
        elif type == Type_Manager.GRADE:
            value = int(value)
            self.students = [s for s in self.students if s.grade != value]
        elif type == Type_Manager.REMARK:
            value = int(value)
            self.students = [s for s in self.students if s.remark != value]
        self.save_students()
        
    def add_student(self, student):
     self.students.append(student)
     self.save_students()
    
def get_major_student(self):
        major_student = self.students[0]
        for student in self.students:
            if student.grade > major_student.grade:
               major_student = student
        return major_student


    	

   
