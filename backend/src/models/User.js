import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide student email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    rollNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    branch: {
      type: String,
      default: 'Computer Science & Engineering',
    },
    specialization: {
      type: String,
      default: 'Artificial Intelligence & Machine Learning',
    },
    year: {
      type: String,
      default: 'Final Year (4th Year)',
    },
    semester: {
      type: Number,
      default: 7,
    },
    cgpa: {
      type: Number,
      default: 9.34,
      min: 0,
      max: 10,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    bio: {
      type: String,
      default: 'Passionate AI/ML researcher & full-stack architect crafting deep learning systems & scalable cloud infrastructure.',
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com/aryan-sharma-ai' },
      linkedin: { type: String, default: 'https://linkedin.com/in/aryan-sharma-ml' },
      scholar: { type: String, default: 'https://scholar.google.com/citations?user=aryan-sharma' },
      portfolio: { type: String, default: 'https://aryansharma.dev' },
    },
    otpCode: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Encrypt password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
