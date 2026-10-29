import Project from '../models/Project.js';
import ResearchPaper from '../models/ResearchPaper.js';
import Achievement from '../models/Achievement.js';
import Subject from '../models/Subject.js';
import Deadline from '../models/Deadline.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';

// @desc    Get aggregated dashboard statistics
// @route   GET /api/analytics/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Concurrently fetch counts and data
    const [
      user,
      totalProjects,
      completedProjects,
      inProgressProjects,
      ideaProjects,
      totalPapers,
      publishedPapers,
      acceptedPapers,
      underReviewPapers,
      totalAchievements,
      totalSubjects,
      subjects,
      deadlines,
      recentActivities,
    ] = await Promise.all([
      User.findById(userId),
      Project.countDocuments({ userId }),
      Project.countDocuments({ userId, status: 'Completed' }),
      Project.countDocuments({ userId, status: 'In Progress' }),
      Project.countDocuments({ userId, status: 'Idea' }),
      ResearchPaper.countDocuments({ userId }),
      ResearchPaper.countDocuments({ userId, status: 'Published' }),
      ResearchPaper.countDocuments({ userId, status: 'Accepted' }),
      ResearchPaper.countDocuments({ userId, status: 'Under Review' }),
      Achievement.countDocuments({ userId }),
      Subject.countDocuments({ userId }),
      Subject.find({ userId }),
      Deadline.find({ userId, status: 'Pending' }).sort({ dueDate: 1 }).limit(5),
      Activity.find({ userId }).sort({ timestamp: -1, createdAt: -1 }).limit(6),
    ]);

    // Calculate total credits & average attendance
    let totalCredits = 0;
    let totalAttendance = 0;
    subjects.forEach((s) => {
      totalCredits += s.credits || 0;
      totalAttendance += s.attendanceRate || 0;
    });
    const avgAttendance = subjects.length > 0 ? (totalAttendance / subjects.length).toFixed(1) : 0;

    // Academic CGPA progression history
    const cgpaTrend = [
      { semester: 'Sem 1', gpa: 8.8 },
      { semester: 'Sem 2', gpa: 9.0 },
      { semester: 'Sem 3', gpa: 9.15 },
      { semester: 'Sem 4', gpa: 9.22 },
      { semester: 'Sem 5', gpa: 9.45 },
      { semester: 'Sem 6', gpa: 9.38 },
      { semester: 'Sem 7 (Current)', gpa: user?.cgpa || 9.34 },
    ];

    // Subject project distribution
    const subjectDistribution = await Promise.all(
      subjects.map(async (subj) => {
        const count = await Project.countDocuments({ userId, subjectId: subj._id });
        return {
          subjectName: subj.name,
          subjectCode: subj.code,
          projectCount: count,
          attendance: subj.attendanceRate,
          credits: subj.credits,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          rollNumber: user.rollNumber,
          branch: user.branch,
          specialization: user.specialization,
          year: user.year,
          semester: user.semester,
          cgpa: user.cgpa,
          avatar: user.avatar,
          bio: user.bio,
        },
        metrics: {
          totalProjects,
          completedProjects,
          inProgressProjects,
          ideaProjects,
          totalPapers,
          publishedPapers,
          acceptedPapers,
          underReviewPapers,
          totalAchievements,
          totalSubjects,
          totalCredits,
          avgAttendance,
          pendingDeadlinesCount: deadlines.length,
        },
        charts: {
          cgpaTrend,
          projectStatusBreakdown: {
            Completed: completedProjects,
            'In Progress': inProgressProjects,
            Idea: ideaProjects,
          },
          researchStatusBreakdown: {
            Published: publishedPapers,
            Accepted: acceptedPapers,
            'Under Review': underReviewPapers,
          },
          subjectDistribution,
        },
        upcomingDeadlines: deadlines,
        recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};
