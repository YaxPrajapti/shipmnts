const express = require('express'); 
const classroomController = require('../contorller/classroomController'); 
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express(); 

router.delete("/:classroomId/students/:studentId", authMiddleware.isTeacher, classroomController.removeStudent);
router.delete("/:classroomId", authMiddleware.isTeacher, classroomController.deleteClass);
router.post("/:classroomId/students", authMiddleware.isTeacher, classroomController.addStudent); 
router.post("/:classroomId/tasks", authMiddleware.isTeacher, classroomController.assignTask);
router.put("/:classroomId", authMiddleware.isTeacher, classroomController.editClassroom)

module.exports = router; 