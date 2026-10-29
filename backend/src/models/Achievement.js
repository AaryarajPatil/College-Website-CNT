import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide achievement title'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Certifications', 'Hackathons', 'Competitions', 'Awards', 'Internships', 'Workshops'],
      required: true,
      default: 'Certifications',
    },
    organization: {
      type: String,
      required: [true, 'Please provide organization/issuer name'],
      trim: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      default: '',
    },
    credentialUrl: {
      type: String,
      default: '',
    },
    badgeIcon: {
      type: String,
      default: 'Award', // Award, Trophy, Certificate, Briefcase, Code, Sparkles
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
