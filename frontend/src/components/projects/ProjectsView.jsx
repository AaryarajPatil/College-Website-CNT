import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Code2,
  Globe,
  Users,
  Clock,
  FileText,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';
import { Modal, ConfirmDialog, EmptyState } from '../common/CommonModals';
import { useToast } from '../../context/ToastContext';
import { projectAPI } from '../../services/api';

export const ProjectsView = ({
  projects = [],
  subjects = [],
  onRefresh,
  onOpenAddModal,
}) => {
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [docModalProject, setDocModalProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);

  // Form data for Editing
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    duration: '',
    status: 'In Progress',
    progress: 50,
    documentation: '',
    featured: false,
  });

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchSubject = subjectFilter === 'All' || p.subjectId === subjectFilter || p.subjectName === subjectFilter;
    const matchSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.technologies || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStatus && matchSubject && matchSearch;
  });

  const handleOpenEdit = (project) => {
    setEditProject(project);
    setEditFormData({
      title: project.title,
      description: project.description,
      subjectId: project.subjectId?._id || project.subjectId || '',
      technologies: (project.technologies || []).join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      duration: project.duration || '3 Months',
      status: project.status || 'In Progress',
      progress: project.progress || 50,
      documentation: project.documentation || '',
      featured: Boolean(project.featured),
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.update(editProject._id, editFormData);
      toast.success('Project updated successfully!');
      setEditProject(null);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project.');
    }
  };

  const handleDelete = async () => {
    if (!deleteProjectId) return;
    try {
      await projectAPI.delete(deleteProjectId);
      toast.success('Project removed from repository.');
      setDeleteProjectId(null);
      onRefresh();
    } catch (err) {
      toast.error('Failed to delete project.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'badge-success';
      case 'In Progress':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="filter-bar">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Project Engineering Repository</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Centralized showcase of software architectures, AI systems, and cloud projects.
          </p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '14px 18px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Status Tabs */}
        <div className="pill-tabs">
          {['All', 'Completed', 'In Progress', 'Idea'].map((st) => (
            <button
              key={st}
              className={`pill-tab ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Subject Filter & Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'flex-end', minWidth: 260 }}>
          <select
            className="form-select"
            style={{ maxWidth: 190, padding: '7px 12px', fontSize: 12.5 }}
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="All">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>

          <div style={{ position: 'relative', width: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 32, padding: '7px 12px 7px 32px', fontSize: 12.5 }}
              placeholder="Search tech, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid-cols-2">
          {filteredProjects.map((proj) => (
            <div key={proj._id} className="glass-panel glass-panel-interactive project-card">
              <div>
                {/* Header: Subject badge & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="badge badge-gold" style={{ fontSize: 11 }}>
                    {proj.subjectName || 'General / Interdisciplinary'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {proj.featured && (
                      <span className="badge badge-purple" style={{ fontSize: 10 }}>
                        <Sparkles size={11} /> Featured
                      </span>
                    )}
                    <span className={`badge ${getStatusBadgeClass(proj.status)}`} style={{ fontSize: 11 }}>
                      {proj.status}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="project-card-title">{proj.title}</h3>
                <p className="project-card-desc">{proj.description}</p>

                {/* Tech Tags */}
                <div className="tech-tag-list">
                  {(proj.technologies || []).map((t, idx) => (
                    <span key={idx} className="tech-tag">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    <span>Project Milestone Progress</span>
                    <strong style={{ color: 'var(--gold-bright)' }}>{proj.progress || 0}%</strong>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${proj.progress || 0}%` }} />
                  </div>
                </div>

                {/* Team Members */}
                {proj.teamMembers && proj.teamMembers.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
                    <Users size={14} color="var(--gold-bright)" />
                    <span>
                      Team: {proj.teamMembers.map((m) => `${m.name} (${m.role || 'Member'})`).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 14,
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: 10,
                }}
              >
                {/* External Links */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                    >
                      <Code2 size={13} />
                      <span>Code</span>
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-gold btn-sm"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                    >
                      <Globe size={13} />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {proj.documentation && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={() => setDocModalProject(proj)}
                    >
                      <FileText size={13} />
                      <span>Docs</span>
                    </button>
                  )}
                </div>

                {/* Edit / Delete buttons */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn-icon btn-secondary btn-sm"
                    style={{ width: 28, height: 28 }}
                    onClick={() => handleOpenEdit(proj)}
                    title="Edit Project"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    className="btn-icon btn-danger btn-sm"
                    style={{ width: 28, height: 28 }}
                    onClick={() => setDeleteProjectId(proj._id)}
                    title="Delete Project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderGit2}
          title="No projects match your filter"
          description="Create a new engineering project or adjust your filters to view ongoing work."
          actionText="+ Add New Project"
          onAction={onOpenAddModal}
        />
      )}

      {/* DOCUMENTATION MODAL */}
      <Modal
        isOpen={!!docModalProject}
        onClose={() => setDocModalProject(null)}
        title={docModalProject ? `${docModalProject.title} - System Documentation` : ''}
        subtitle="Architecture notes, hardware specs, and algorithmic benchmarks"
      >
        <div style={{ background: 'var(--bg-surface)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {docModalProject?.documentation}
          </p>
        </div>
        <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
          <button className="btn btn-gold btn-sm" onClick={() => setDocModalProject(null)}>
            Close
          </button>
        </div>
      </Modal>

      {/* EDIT PROJECT MODAL */}
      <Modal
        isOpen={!!editProject}
        onClose={() => setEditProject(null)}
        title="Edit Project Details"
        subtitle={`Updating ${editFormData.title}`}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              className="form-input"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Associated Subject</label>
              <select
                className="form-select"
                value={editFormData.subjectId}
                onChange={(e) => setEditFormData({ ...editFormData, subjectId: e.target.value })}
              >
                <option value="">General / Interdisciplinary</option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={editFormData.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setEditFormData({
                    ...editFormData,
                    status: newStatus,
                    progress: newStatus === 'Completed' ? 100 : editFormData.progress,
                  });
                }}
              >
                <option value="Idea">Idea / Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Technologies (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="PyTorch, React, Docker"
                value={editFormData.technologies}
                onChange={(e) => setEditFormData({ ...editFormData, technologies: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Progress ({editFormData.progress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                style={{ width: '100%', accentColor: 'var(--gold-bright)', marginTop: 8 }}
                value={editFormData.progress}
                onChange={(e) => setEditFormData({ ...editFormData, progress: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">GitHub Repository URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/..."
                value={editFormData.githubUrl}
                onChange={(e) => setEditFormData({ ...editFormData, githubUrl: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Live Deployment URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://app.vierp.live"
                value={editFormData.liveUrl}
                onChange={(e) => setEditFormData({ ...editFormData, liveUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Technical Documentation & Architecture</label>
            <textarea
              className="form-textarea"
              placeholder="Detailed architecture notes, benchmarks, algorithms..."
              value={editFormData.documentation}
              onChange={(e) => setEditFormData({ ...editFormData, documentation: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditProject(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-gold btn-sm">
              Save Project
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteProjectId}
        onClose={() => setDeleteProjectId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to permanently delete this project from your academic repository?"
        confirmText="Delete Project"
      />
    </div>
  );
};
