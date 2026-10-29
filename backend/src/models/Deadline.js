import mongoose from 'mongoose';

const deadlineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide deadline title'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Assignment', 'Exam', 'Project Milestone', 'Conference', 'Hackathon', 'Submission', 'Other'],
      default: 'Assignment',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
    subjectName: {
      type: String,
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Deadline = mongoose.model('Deadline', deadlineSchema);
export default Deadline;
