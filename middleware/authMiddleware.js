module.exports.isTeacher = (req, res, next) => {
    if (!req.session.userId || req.session.role !== 'teacher') {
        return res.status(403).json({ message: 'Access denied. Only teachers can perform this action.' });
    }
    next();
};

module.exports.isStudent = (req, res, next) => {
    if(!req.session.userId || req.session.role != 'student'){
        return res.status(403).json({ message: 'Access denied. Only Students can perform this action.' });
    }
    next(); 
}