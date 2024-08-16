const bcrypt = require("bcryptjs");
const Teacher = require("../model/teacherSchema");

module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
    });
    const savedTeacher = await teacher.save();
    req.session.userId = savedTeacher._id;
    req.session.role = "teacher";
    res.status(201).json({
      message: "Teacher registered successfully",
      teacherId: savedTeacher._id,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        req.session.userId = teacher._id;
        req.session.role = 'teacher';

        res.status(200).json({
            message: 'Logged in successfully',
            teacherId: teacher._id
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};