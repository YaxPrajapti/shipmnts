const express = require('express'); 
const studentAuthContorller = require('../contorller/studentAuthController'); 

const router = express(); 

router.post('/register', studentAuthContorller.register); 
router.post('/login', studentAuthContorller.login);

module.exports = router; 