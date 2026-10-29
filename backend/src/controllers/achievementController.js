import Achievement from '../models/Achievement.js';
import Activity from '../models/Activity.js';

// @desc    Get all achievements for student
// @route   GET /api/achievements
export const getAchievements = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = { userId: req.user._id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const achievements = await Achievement.find(query).sort({ issueDate: -1 });

    // Category breakdown count
    const categoryStats = {
      Certifications: await Achievement.countDocuments({ userId: req.user._id, category: 'Certifications' }),
      Hackathons: await Achievement.countDocuments({ userId: req.user._id, category: 'Hackathons' }),
      Competitions: await Achievement.countDocuments({ userId: req.user._id, category: 'Competitions' }),
      Awards: await Achievement.countDocuments({ userId: req.user._id, category: 'Awards' }),
      Internships: await Achievement.countDocuments({ userId: req.user._id, category: 'Internships' }),
      Workshops: await Achievement.countDocuments({ userId: req.user._id, category: 'Workshops' }),
    };

    res.status(200).json({
      success: true,
      count: achievements.length,
      categoryStats,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new achievement
// @route   POST /api/achievements
export const createAchievement = async (req, res, next) => {
  try {
    const { title, category, organization, issueDate, description, credentialUrl, badgeIcon, skills } = req.body;

    const achievement = await Achievement.create({
      userId: req.user._id,
      title,
      category: category || 'Certifications',
      organization,
      issueDate: issueDate || Date.now(),
      description: description || '',
      credentialUrl: credentialUrl || '',
      badgeIcon: badgeIcon || 'Award',
      skills: Array.isArray(skills)
        ? skills
        : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
    });

    await Activity.create({
      userId: req.user._id,
      title: `Achievement: ${achievement.title}`,
      type: 'achievement_earned',
      description: `Earned ${achievement.category} credential from ${achievement.organization}.`,
      category: 'Achievements',
      icon: 'Trophy',
      metadata: { achievementId: achievement._id, category: achievement.category },
    });

    res.status(201).json({
      success: true,
      message: 'Achievement added successfully!',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
export const updateAchievement = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (typeof updateData.skills === 'string') {
      updateData.skills = updateData.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const achievement = await Achievement.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully!',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
export const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};
