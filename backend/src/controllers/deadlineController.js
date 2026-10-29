import Deadline from '../models/Deadline.js';
import Subject from '../models/Subject.js';
import Activity from '../models/Activity.js';

// @desc    Get all student deadlines
// @route   GET /api/deadlines
export const getDeadlines = async (req, res, next) => {
  try {
    const { status, priority, type } = req.query;
    const query = { userId: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    const deadlines = await Deadline.find(query).sort({ dueDate: 1 });

    const upcomingCount = await Deadline.countDocuments({
      userId: req.user._id,
      status: 'Pending',
      dueDate: { $gte: new Date() },
    });

    res.status(200).json({
      success: true,
      count: deadlines.length,
      upcomingCount,
      data: deadlines,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new deadline
// @route   POST /api/deadlines
export const createDeadline = async (req, res, next) => {
  try {
    const { title, type, dueDate, subjectId, priority, description } = req.body;

    let subjectName = 'General';
    if (subjectId) {
      const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
      if (subject) {
        subjectName = subject.name;
      }
    }

    const deadline = await Deadline.create({
      userId: req.user._id,
      title,
      type: type || 'Assignment',
      dueDate,
      subjectId: subjectId || null,
      subjectName,
      priority: priority || 'Medium',
      description: description || '',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Deadline scheduled successfully!',
      data: deadline,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle deadline status (Pending <-> Completed)
// @route   PATCH /api/deadlines/:id/toggle
export const toggleDeadline = async (req, res, next) => {
  try {
    const deadline = await Deadline.findOne({ _id: req.params.id, userId: req.user._id });

    if (!deadline) {
      return res.status(404).json({
        success: false,
        message: 'Deadline not found.',
      });
    }

    deadline.status = deadline.status === 'Completed' ? 'Pending' : 'Completed';
    await deadline.save();

    if (deadline.status === 'Completed') {
      await Activity.create({
        userId: req.user._id,
        title: `Deadline Completed: ${deadline.title}`,
        type: 'deadline_cleared',
        description: `Completed ${deadline.type} for ${deadline.subjectName}.`,
        category: 'Deadlines',
        icon: 'CheckSquare',
        metadata: { deadlineId: deadline._id },
      });
    }

    res.status(200).json({
      success: true,
      message: `Deadline marked as ${deadline.status.toLowerCase()}!`,
      data: deadline,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete deadline
// @route   DELETE /api/deadlines/:id
export const deleteDeadline = async (req, res, next) => {
  try {
    const deadline = await Deadline.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deadline) {
      return res.status(404).json({
        success: false,
        message: 'Deadline not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deadline removed successfully!',
    });
  } catch (error) {
    next(error);
  }
};
