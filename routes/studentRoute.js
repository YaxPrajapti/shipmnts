const express = require("express"); 
const studentController = require('../contorller/studentController'); 
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router(); 

router.get("/:studentId/classrooms", authMiddleware.isStudent, studentController.viewEnrolledClass);
// /students/{studentId}/classrooms/{classroomId}/tasks
router.get("/:studentId/classrooms/:classroomId/tasks", authMiddleware.isStudent, studentController.viewTask);

module.exports = router; 