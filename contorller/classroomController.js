const Classroom = require("../model/classroomSchema");
const Teacher = require("../model/teacherSchema");
const Student = require("../model/studentSchema");
const Task = require("../model/taskSchema");

module.exports.createClassroom = async (req, res, next) => {
  try {
    const { classroomName } = req.body;
    const teacherId = req.params.teacherId;
    if (!classroomName) {
      return res.status(400).json({ message: "Classroom name is required" });
    }
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const existingClassroom = await Classroom.findOne({
      name: classroomName,
      teacher: teacherId,
    });
    if (existingClassroom) {
      return res.status(400).json({ message: "Classroom name already exists" });
    }
    const classroom = new Classroom({
      name: classroomName,
      teacher: teacherId,
    });
    const savedClassroom = await classroom.save();
    res.status(201).json({
      classroomId: savedClassroom._id,
      classroomName: savedClassroom.name,
    });
  } catch (error) {
    console.error("Error creating classroom:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.addStudent = async (req, res, next) => {
  try {
    const { classroomId } = req.params;
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (classroom.students.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "Student is already in the classroom" });
    }
    classroom.students.push(studentId);
    await classroom.save();

    res.status(200).json({ message: "Student added successfully." });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.removeStudent = async (req, res, next) => {
  try {
    const { classroomId, studentId } = req.params;
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    if (!classroom.students.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "Student is not in the classroom" });
    }
    classroom.students = classroom.students.filter(
      (id) => id.toString() !== studentId
    );
    await classroom.save();
    res.status(200).json({ message: "Student removed successfully." });
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.assignTask = async (req, res, next) => {
  try {
    const { classroomId } = req.params;
    const { title, description, dueDate } = req.body;
    if (!title || !description || !dueDate) {
      return res.status(400).json({
        message: "All fields are required: title, description, due date",
      });
    }
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    const task = new Task({
      title,
      description,
      dueDate,
      classroom: classroomId,
    });
    const savedTask = await task.save();
    res.status(201).json({
      taskId: savedTask._id,
      title: savedTask.title,
      description: savedTask.description,
      dueDate: savedTask.dueDate,
    });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.viewClassroom = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const classrooms = await Classroom.find({ teacher: teacherId });
    if (!classrooms || classrooms.length === 0) {
      return res
        .status(404)
        .json({ message: "Teacher has not created classroom yet." });
    }
    res.status(200).json({
      classrooms: classrooms.map((classroom) => ({
        classroomId: classroom._id,
        classroomName: classroom.name,
        createdAt: classroom.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.editClassroom = async (req, res, next) => {
  try {
    const { classroomId } = req.params;
    const { classroomName } = req.body;
    if (!classroomName) {
      return res.status(400).json({ message: "Classroom name is required" });
    }
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    if (req.session.userId !== classroom.teacher.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only edit your own classrooms.",
      });
    }
    classroom.name = classroomName;
    await classroom.save();
    res.status(200).json({ message: "Classroom updated successfully." });
  } catch (error) {
    console.error("Error updating classroom:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
