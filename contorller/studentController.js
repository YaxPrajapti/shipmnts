const Classroom = require("../model/classroomSchema");
const Task = require("../model/taskSchema"); 


module.exports.viewEnrolledClass = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const classrooms = await Classroom.find({ students: studentId });
    if (!classrooms || classrooms.length === 0) {
      return res
        .status(404)
        .json({ message: "Student is not enrolled in any classroom" });
    }
    res.status(200).json(
      classrooms.map((classroom) => ({
        classroomId: classroom._id,
        classroomName: classroom.name,
      }))
    );
  } catch (error) {
    console.error("Error fetching student classrooms:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.viewTask = async (req, res, next) => {
  try {
    const { studentId, classroomId } = req.params;
    const classroom = await Classroom.findOne({
      _id: classroomId,
      students: studentId,
    });
    if (!classroom) {
      return res
        .status(403)
        .json({
          message: "Access denied. You are not enrolled in this classroom.",
        });
    }
    const tasks = await Task.find({ classroom: classroomId });
    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found for this classroom" });
    }
    res.status(200).json(
      tasks.map((task) => ({
        taskId: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
      }))
    );
  } catch (error) {
    console.error("Error fetching classroom tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
