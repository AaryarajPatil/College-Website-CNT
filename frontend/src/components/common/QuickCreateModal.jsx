import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from './CommonModals';
import { useToast } from '../../context/ToastContext';
import {
  projectAPI,
  subjectAPI,
  researchAPI,
  achievementAPI,
  deadlineAPI,
} from '../../services/api';

export const QuickCreateModal = ({
  type, // 'project' | 'research' | 'achievement' | 'subject' | 'deadline'
  isOpen,
  onClose,
  subjects = [],
  onSuccess,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // Form states
  const [projData, setProjData] = useState({
    title: '',
    description: '',
    subjectId: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    duration: '3 Months',
    status: 'In Progress',
    progress: 50,
    documentation: '',
    featured: false,
  });

  const [paperData, setPaperData] = useState({
    title: '',
    abstract: '',
    conferenceJournal: '',
    authors: 'Aryan Sharma',
    submissionDate: new Date().toISOString().split('T')[0],
    doi: '',
    paperUrl: '',
    status: 'Draft',
    conferenceDeadline: '',
    keywords: '',
    impactFactor: '',
  });

  const [achData, setAchData] = useState({
    title: '',
    category: 'Certifications',
    organization: '',
    issueDate: new Date().toISOString().split('T')[0],
    description: '',
    credentialUrl: '',
    skills: '',
  });

  const [subjData, setSubjData] = useState({
    name: '',
    code: '',
    credits: 4,
    professor: '',
    attendanceRate: 90,
    semester: 7,
    description: '',
  });

  const [deadData, setDeadData] = useState({
    title: '',
    type: 'Assignment',
    dueDate: '',
    subjectId: '',
    priority: 'Medium',
    description: '',
  });

  // Trigger luxury gold confetti burst
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#F59E0B', '#FDE047', '#FFFFFF'],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'project') {
        await projectAPI.create(projData);
        toast.success('New engineering project recorded!');
        triggerConfetti();
      } else if (type === 'research') {
        await researchAPI.create(paperData);
        toast.success('Research manuscript created successfully!');
        triggerConfetti();
      } else if (type === 'achievement') {
        await achievementAPI.create(achData);
        toast.success('Achievement milestone unlocked!');
        triggerConfetti();
      } else if (type === 'subject') {
        await subjectAPI.create(subjData);
        toast.success('New academic course registered!');
      } else if (type === 'deadline') {
        await deadlineAPI.create(deadData);
        toast.success('New deadline scheduled on calendar!');
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case 'project':
        return 'Create Engineering Project';
      case 'research':
        return 'Record Research Paper / Publication';
      case 'achievement':
        return 'Add Honors / Certification';
      case 'subject':
        return 'Enroll Academic Subject';
      case 'deadline':
        return 'Schedule Academic Deadline';
      default:
        return 'Create Entry';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} maxWidth="640px">
      <form onSubmit={handleSubmit}>
        {/* PROJECT FORM */}
        {type === 'project' && (
          <>
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Distributed Vector Database Engine"
                value={projData.title}
                onChange={(e) => setProjData({ ...projData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Provide a high-level summary of problem statement and architecture..."
                value={projData.description}
                onChange={(e) => setProjData({ ...projData, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Assign to Subject</label>
                <select
                  className="form-select"
                  value={projData.subjectId}
                  onChange={(e) => setProjData({ ...projData, subjectId: e.target.value })}
                >
                  <option value="">General / Interdisciplinary</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={projData.status}
                  onChange={(e) => setProjData({ ...projData, status: e.target.value })}
                >
                  <option value="Idea">Idea / Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Technologies (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="PyTorch, FastAPI, React, Docker, CUDA"
                value={projData.technologies}
                onChange={(e) => setProjData({ ...projData, technologies: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">GitHub Repository URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/..."
                  value={projData.githubUrl}
                  onChange={(e) => setProjData({ ...projData, githubUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Live Deployment URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://app.vierp.live"
                  value={projData.liveUrl}
                  onChange={(e) => setProjData({ ...projData, liveUrl: e.target.value })}
                />
              </div>
            </div>
          </>
        )}

        {/* RESEARCH FORM */}
        {type === 'research' && (
          <>
            <div className="form-group">
              <label className="form-label">Manuscript Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. KV-Cache Allocation in Distributed LLM Serving"
                value={paperData.title}
                onChange={(e) => setPaperData({ ...paperData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Abstract *</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: 90 }}
                placeholder="Structured abstract explaining motivation, methodology, and empirical findings..."
                value={paperData.abstract}
                onChange={(e) => setPaperData({ ...paperData, abstract: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Target Conference / Journal *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. NeurIPS 2026 / IEEE TNNLS"
                  value={paperData.conferenceJournal}
                  onChange={(e) => setPaperData({ ...paperData, conferenceJournal: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={paperData.status}
                  onChange={(e) => setPaperData({ ...paperData, status: e.target.value })}
                >
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Authors (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={paperData.authors}
                  onChange={(e) => setPaperData({ ...paperData, authors: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Keywords (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Transformers, Compression, Quantization"
                  value={paperData.keywords}
                  onChange={(e) => setPaperData({ ...paperData, keywords: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">DOI (if published)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="10.1109/..."
                  value={paperData.doi}
                  onChange={(e) => setPaperData({ ...paperData, doi: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Paper / arXiv Link</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://arxiv.org/abs/..."
                  value={paperData.paperUrl}
                  onChange={(e) => setPaperData({ ...paperData, paperUrl: e.target.value })}
                />
              </div>
            </div>
          </>
        )}

        {/* ACHIEVEMENT FORM */}
        {type === 'achievement' && (
          <>
            <div className="form-group">
              <label className="form-label">Achievement Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 1st Place - National Hackathon 2025"
                value={achData.title}
                onChange={(e) => setAchData({ ...achData, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={achData.category}
                  onChange={(e) => setAchData({ ...achData, category: e.target.value })}
                >
                  <option value="Certifications">Certifications</option>
                  <option value="Hackathons">Hackathons</option>
                  <option value="Competitions">Competitions</option>
                  <option value="Awards">Awards</option>
                  <option value="Internships">Internships</option>
                  <option value="Workshops">Workshops</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Issuing Organization *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Amazon Web Services / Google"
                  value={achData.organization}
                  onChange={(e) => setAchData({ ...achData, organization: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Issue Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={achData.issueDate}
                  onChange={(e) => setAchData({ ...achData, issueDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Credential Verification URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={achData.credentialUrl}
                  onChange={(e) => setAchData({ ...achData, credentialUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Skills Acquired (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Cloud Architecture, PyTorch, Leadership"
                value={achData.skills}
                onChange={(e) => setAchData({ ...achData, skills: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description / Recognition Details</label>
              <textarea
                className="form-textarea"
                placeholder="Brief summary of what was accomplished and award prize..."
                value={achData.description}
                onChange={(e) => setAchData({ ...achData, description: e.target.value })}
              />
            </div>
          </>
        )}

        {/* SUBJECT FORM */}
        {type === 'subject' && (
          <>
            <div className="form-group">
              <label className="form-label">Subject Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Natural Language Processing"
                value={subjData.name}
                onChange={(e) => setSubjData({ ...subjData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Course Code *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="CS707"
                  value={subjData.code}
                  onChange={(e) => setSubjData({ ...subjData, code: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Credits</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  className="form-input"
                  value={subjData.credits}
                  onChange={(e) => setSubjData({ ...subjData, credits: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Professor / Faculty</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dr. Rajesh Iyer"
                  value={subjData.professor}
                  onChange={(e) => setSubjData({ ...subjData, professor: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Attendance Target (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input"
                  value={subjData.attendanceRate}
                  onChange={(e) => setSubjData({ ...subjData, attendanceRate: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Curriculum Description</label>
              <textarea
                className="form-textarea"
                placeholder="Core topics covered in this course..."
                value={subjData.description}
                onChange={(e) => setSubjData({ ...subjData, description: e.target.value })}
              />
            </div>
          </>
        )}

        {/* DEADLINE FORM */}
        {type === 'deadline' && (
          <>
            <div className="form-group">
              <label className="form-label">Deadline Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Final Lab Assignment Submission"
                value={deadData.title}
                onChange={(e) => setDeadData({ ...deadData, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Deadline Type</label>
                <select
                  className="form-select"
                  value={deadData.type}
                  onChange={(e) => setDeadData({ ...deadData, type: e.target.value })}
                >
                  <option value="Assignment">Assignment</option>
                  <option value="Exam">Exam</option>
                  <option value="Project Milestone">Project Milestone</option>
                  <option value="Conference">Conference</option>
                  <option value="Hackathon">Hackathon</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={deadData.priority}
                  onChange={(e) => setDeadData({ ...deadData, priority: e.target.value })}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={deadData.dueDate}
                  onChange={(e) => setDeadData({ ...deadData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Associated Subject</label>
                <select
                  className="form-select"
                  value={deadData.subjectId}
                  onChange={(e) => setDeadData({ ...deadData, subjectId: e.target.value })}
                >
                  <option value="">General</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes / Instructions</label>
              <textarea
                className="form-textarea"
                placeholder="Submission instructions or guidelines..."
                value={deadData.description}
                onChange={(e) => setDeadData({ ...deadData, description: e.target.value })}
              />
            </div>
          </>
        )}

        <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-gold btn-sm" disabled={loading}>
            {loading ? 'Saving Entry...' : 'Create Entry'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
