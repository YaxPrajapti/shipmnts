const bcrypt = require('bcryptjs');
const Student = require('../model/studentSchema');

module.exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const student = new Student({
            name,
            email,
            password: hashedPassword
        });
        const savedStudent = await student.save();
        req.session.userId = savedStudent._id;
        req.session.role = 'student';

        res.status(201).json({
            message: 'Student registered successfully',
            studentId: savedStudent._id
        });
    } catch (error) {
        console.error("Error during student registration:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        req.session.userId = student._id;
        req.session.role = 'student';
        console.log(req.session);
        res.status(200).json({
            message: 'Logged in successfully',
            studentId: student._id
        });
    } catch (error) {
        console.error("Error during student login:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
