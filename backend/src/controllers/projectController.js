import Project from '../models/Project.js';
import Subject from '../models/Subject.js';
import Activity from '../models/Activity.js';

// @desc    Get all projects for student with optional filtering
// @route   GET /api/projects
export const getProjects = async (req, res, next) => {
  try {
    const { status, subjectId, search, featured } = req.query;

    const query = { userId: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (subjectId && subjectId !== 'All') {
      query.subjectId = subjectId;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const projects = await Project.find(query).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('subjectId', 'name code colorTag');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      subjectId,
      technologies,
      githubUrl,
      liveUrl,
      teamMembers,
      duration,
      documentation,
      status,
      progress,
      featured,
    } = req.body;

    let subjectName = 'General / Interdisciplinary';
    if (subjectId) {
      const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
      if (subject) {
        subjectName = subject.name;
      }
    }

    const project = await Project.create({
      userId: req.user._id,
      title,
      description,
      subjectId: subjectId || null,
      subjectName,
      technologies: Array.isArray(technologies)
        ? technologies
        : (technologies || '').split(',').map((t) => t.trim()).filter(Boolean),
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      teamMembers: teamMembers || [],
      duration: duration || '3 Months',
      documentation: documentation || '',
      status: status || 'In Progress',
      progress: progress !== undefined ? Number(progress) : status === 'Completed' ? 100 : 35,
      featured: Boolean(featured),
    });

    // Record Activity
    await Activity.create({
      userId: req.user._id,
      title: `New Project: ${project.title}`,
      type: project.status === 'Completed' ? 'project_completed' : 'project_created',
      description: `Initiated project under ${project.subjectName} with [${(project.technologies || []).slice(0, 3).join(', ')}].`,
      category: 'Projects',
      icon: 'FolderGit2',
      metadata: { projectId: project._id, status: project.status },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const existingProject = await Project.findOne({ _id: req.params.id, userId: req.user._id });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    const updateData = { ...req.body };

    if (updateData.subjectId && updateData.subjectId !== existingProject.subjectId?.toString()) {
      const subject = await Subject.findOne({ _id: updateData.subjectId, userId: req.user._id });
      updateData.subjectName = subject ? subject.name : 'General';
    }

    if (typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }

    if (updateData.status === 'Completed' && existingProject.status !== 'Completed') {
      updateData.progress = 100;
      await Activity.create({
        userId: req.user._id,
        title: `Project Completed: ${existingProject.title}`,
        type: 'project_completed',
        description: `Successfully reached 100% completion milestone on ${existingProject.title}.`,
        category: 'Projects',
        icon: 'CheckCircle',
        metadata: { projectId: existingProject._id },
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Project updated successfully!',
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project removed successfully!',
    });
  } catch (error) {
    next(error);
  }
};
