const express = require('express'); 

const TeacherAuthController = require('../contorller/TeacherRegAuthController'); 
const router = express.Router(); 

router.post('/register', TeacherAuthController.register); 
router.post('/login', TeacherAuthController.login);
module.exports = router; 