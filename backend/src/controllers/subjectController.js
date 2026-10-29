import Subject from '../models/Subject.js';
import Project from '../models/Project.js';
import Activity from '../models/Activity.js';

// @desc    Get all subjects for the logged-in student
// @route   GET /api/subjects
export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Aggregate linked projects count for each subject
    const subjectsWithProjectCount = await Promise.all(
      subjects.map(async (subj) => {
        const projectCount = await Project.countDocuments({
          userId: req.user._id,
          subjectId: subj._id,
        });
        return {
          ...subj.toObject(),
          projectCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: subjectsWithProjectCount.length,
      data: subjectsWithProjectCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single subject with its projects
// @route   GET /api/subjects/:id
export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.',
      });
    }

    const projects = await Project.find({
      userId: req.user._id,
      subjectId: subject._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...subject.toObject(),
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
export const createSubject = async (req, res, next) => {
  try {
    const { name, code, credits, professor, attendanceRate, semester, colorTag, description, syllabusTopics } = req.body;

    const subject = await Subject.create({
      userId: req.user._id,
      name,
      code,
      credits: credits || 4,
      professor: professor || 'Department Faculty',
      attendanceRate: attendanceRate || 85,
      semester: semester || req.user.semester || 7,
      colorTag: colorTag || '#D4AF37',
      description: description || '',
      syllabusTopics: syllabusTopics || [],
    });

    await Activity.create({
      userId: req.user._id,
      title: `Subject Enrolled: ${subject.name}`,
      type: 'subject_enrolled',
      description: `Enrolled in ${subject.name} (${subject.code}) with ${subject.credits} credits.`,
      category: 'Academic',
      icon: 'BookOpen',
      metadata: { subjectId: subject._id, code: subject.code },
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully!',
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
export const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully!',
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.',
      });
    }

    // Unlink projects from this subject
    await Project.updateMany(
      { subjectId: subject._id },
      { $set: { subjectId: null, subjectName: 'General / Interdisciplinary' } }
    );

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};
