const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSubmissionSchema = new Schema({
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    submissionStatus: { type: String, enum: ['submitted', 'pending'], default: 'pending' },
    submittedAt: { type: Date },
    documentPath: { type: String }
});

module.exports = mongoose.model('TaskSubmission', taskSubmissionSchema);
