import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide project description'],
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
    subjectName: {
      type: String,
      default: 'General / Interdisciplinary',
    },
    technologies: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      default: '',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    teamMembers: [
      {
        name: String,
        role: String,
      },
    ],
    duration: {
      type: String,
      default: '3 Months',
    },
    documentation: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Idea', 'In Progress', 'Completed'],
      default: 'In Progress',
    },
    progress: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
