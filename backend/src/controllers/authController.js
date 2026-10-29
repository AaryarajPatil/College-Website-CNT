import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'vierp_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new student
// @route   POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, rollNumber, branch, specialization, year, semester, cgpa } = req.body;

    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, and roll number.',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A student with this email address already exists.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      rollNumber,
      branch: branch || 'Computer Science & Engineering',
      specialization: specialization || 'Artificial Intelligence & Machine Learning',
      year: year || 'Final Year (4th Year)',
      semester: semester || 7,
      cgpa: cgpa || 8.5,
    });

    // Log Activity
    await Activity.create({
      userId: user._id,
      title: 'Academic Profile Created',
      type: 'profile_updated',
      description: `Welcome to Premium Vierp! Profile initialized for ${user.name} (${user.rollNumber}).`,
      category: 'Profile',
      icon: 'UserCheck',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Student account created successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch,
        specialization: user.specialization,
        year: user.year,
        semester: user.semester,
        cgpa: user.cgpa,
        avatar: user.avatar,
        bio: user.bio,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch,
        specialization: user.specialization,
        year: user.year,
        semester: user.semester,
        cgpa: user.cgpa,
        avatar: user.avatar,
        bio: user.bio,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student profile
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    // Don't allow password update through this endpoint
    delete updates.password;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    await Activity.create({
      userId: user._id,
      title: 'Profile Updated',
      type: 'profile_updated',
      description: 'Student profile settings and portfolio metadata were updated.',
      category: 'Profile',
      icon: 'Settings',
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request password reset / OTP
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No student account found with this email.',
      });
    }

    // Generate 6 digit OTP for demo/verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been generated. (For testing: OTP is ${otp})`,
      otpPreview: otp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email: email.toLowerCase(),
      otpCode: otp,
      otpExpires: { $gt: Date.now() },
    }).select('+otpCode +otpExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code. Please request a new one.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully! You may now reset your password.',
      verified: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
      email: email.toLowerCase(),
      otpCode: otp,
      otpExpires: { $gt: Date.now() },
    }).select('+password +otpCode +otpExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification session.',
      });
    }

    user.password = newPassword;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! Logged in with new credentials.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch,
        specialization: user.specialization,
        semester: user.semester,
        cgpa: user.cgpa,
      },
    });
  } catch (error) {
    next(error);
  }
};
