import Activity from '../models/Activity.js';

// @desc    Get student activity timeline
// @route   GET /api/activities
export const getActivities = async (req, res, next) => {
  try {
    const { limit = 20, type, category } = req.query;
    const query = { userId: req.user._id };

    if (type && type !== 'All') {
      query.type = type;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const activities = await Activity.find(query)
      .sort({ timestamp: -1, createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};
