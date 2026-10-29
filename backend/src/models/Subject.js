import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide subject name'],
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      default: 4,
    },
    professor: {
      type: String,
      default: 'Dr. John Doe',
    },
    attendanceRate: {
      type: Number,
      default: 90,
      min: 0,
      max: 100,
    },
    semester: {
      type: Number,
      default: 7,
    },
    colorTag: {
      type: String,
      default: '#D4AF37', // Default Golden
    },
    description: {
      type: String,
      default: '',
    },
    syllabusTopics: [
      {
        topic: String,
        isCompleted: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
