const Classroom = require("../model/classroomSchema");
const Teacher = require("../model/teacherSchema");

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
