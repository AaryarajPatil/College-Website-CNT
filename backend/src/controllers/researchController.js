import ResearchPaper from '../models/ResearchPaper.js';
import Activity from '../models/Activity.js';

// @desc    Get all research papers for the student
// @route   GET /api/research
export const getPapers = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = { userId: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } },
        { conferenceJournal: { $regex: search, $options: 'i' } },
        { authors: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const papers = await ResearchPaper.find(query).sort({ submissionDate: -1 });

    // Pipeline counts
    const statusCounts = {
      Draft: await ResearchPaper.countDocuments({ userId: req.user._id, status: 'Draft' }),
      Submitted: await ResearchPaper.countDocuments({ userId: req.user._id, status: 'Submitted' }),
      'Under Review': await ResearchPaper.countDocuments({ userId: req.user._id, status: 'Under Review' }),
      Accepted: await ResearchPaper.countDocuments({ userId: req.user._id, status: 'Accepted' }),
      Published: await ResearchPaper.countDocuments({ userId: req.user._id, status: 'Published' }),
      Rejected: await ResearchPaper.countDocuments({ userId: req.user._id, status: 'Rejected' }),
    };

    res.status(200).json({
      success: true,
      count: papers.length,
      statusCounts,
      data: papers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single paper
// @route   GET /api/research/:id
export const getPaperById = async (req, res, next) => {
  try {
    const paper = await ResearchPaper.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Research paper not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: paper,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create research paper
// @route   POST /api/research
export const createPaper = async (req, res, next) => {
  try {
    const {
      title,
      abstract,
      conferenceJournal,
      authors,
      submissionDate,
      doi,
      paperUrl,
      status,
      conferenceDeadline,
      keywords,
      impactFactor,
    } = req.body;

    const paper = await ResearchPaper.create({
      userId: req.user._id,
      title,
      abstract,
      conferenceJournal,
      authors: Array.isArray(authors)
        ? authors
        : (authors || '').split(',').map((a) => a.trim()).filter(Boolean),
      submissionDate: submissionDate || Date.now(),
      doi: doi || '',
      paperUrl: paperUrl || '',
      status: status || 'Draft',
      conferenceDeadline: conferenceDeadline || null,
      keywords: Array.isArray(keywords)
        ? keywords
        : (keywords || '').split(',').map((k) => k.trim()).filter(Boolean),
      impactFactor: impactFactor || '',
    });

    await Activity.create({
      userId: req.user._id,
      title: `Research Added: ${paper.title}`,
      type: paper.status === 'Published' ? 'paper_published' : 'paper_submitted',
      description: `Manuscript added targeting ${paper.conferenceJournal} with status [${paper.status}].`,
      category: 'Research',
      icon: 'BookMarked',
      metadata: { paperId: paper._id, status: paper.status },
    });

    res.status(201).json({
      success: true,
      message: 'Research paper recorded successfully!',
      data: paper,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update research paper
// @route   PUT /api/research/:id
export const updatePaper = async (req, res, next) => {
  try {
    const existing = await ResearchPaper.findOne({ _id: req.params.id, userId: req.user._id });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Research paper not found.',
      });
    }

    const updateData = { ...req.body };
    if (typeof updateData.authors === 'string') {
      updateData.authors = updateData.authors.split(',').map((a) => a.trim()).filter(Boolean);
    }
    if (typeof updateData.keywords === 'string') {
      updateData.keywords = updateData.keywords.split(',').map((k) => k.trim()).filter(Boolean);
    }

    if (updateData.status && updateData.status !== existing.status) {
      const type =
        updateData.status === 'Accepted'
          ? 'paper_accepted'
          : updateData.status === 'Published'
          ? 'paper_published'
          : 'paper_submitted';

      await Activity.create({
        userId: req.user._id,
        title: `Paper Status Update: ${existing.title}`,
        type,
        description: `Status updated from ${existing.status} -> ${updateData.status} at ${existing.conferenceJournal}.`,
        category: 'Research',
        icon: 'Award',
        metadata: { paperId: existing._id, newStatus: updateData.status },
      });
    }

    const updated = await ResearchPaper.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Research paper updated successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete research paper
// @route   DELETE /api/research/:id
export const deletePaper = async (req, res, next) => {
  try {
    const paper = await ResearchPaper.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Research paper not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Research paper deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};
