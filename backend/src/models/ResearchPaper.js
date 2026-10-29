import mongoose from 'mongoose';

const researchPaperSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide research paper title'],
      trim: true,
    },
    abstract: {
      type: String,
      required: [true, 'Please provide abstract'],
    },
    conferenceJournal: {
      type: String,
      required: [true, 'Please specify conference or journal name'],
    },
    authors: {
      type: [String],
      default: [],
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    doi: {
      type: String,
      default: '',
    },
    paperUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Under Review', 'Accepted', 'Published', 'Rejected'],
      default: 'Draft',
    },
    conferenceDeadline: {
      type: Date,
      default: null,
    },
    keywords: {
      type: [String],
      default: [],
    },
    impactFactor: {
      type: String,
      default: '',
    },
    citations: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ResearchPaper = mongoose.model('ResearchPaper', researchPaperSchema);
export default ResearchPaper;
