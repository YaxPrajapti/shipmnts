const express = require('express'); 
const classroomController = require('../contorller/classroomController'); 
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router(); 

router.post("/:teacherId/classrooms", authMiddleware.isTeacher, classroomController.createClassroom); 

module.exports = router; 