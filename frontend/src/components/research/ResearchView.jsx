import React, { useState } from 'react';
import {
  BookMarked,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  Users,
  Award,
  Sparkles,
  FileText,
  Search,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Modal, ConfirmDialog, EmptyState } from '../common/CommonModals';
import { useToast } from '../../context/ToastContext';
import { researchAPI } from '../../services/api';

export const ResearchView = ({
  papers = [],
  statusCounts = {},
  onRefresh,
  onOpenAddModal,
}) => {
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAbstractId, setExpandedAbstractId] = useState(null);

  const [editPaper, setEditPaper] = useState(null);
  const [deletePaperId, setDeletePaperId] = useState(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    title: '',
    abstract: '',
    conferenceJournal: '',
    authors: '',
    submissionDate: '',
    doi: '',
    paperUrl: '',
    status: 'Draft',
    conferenceDeadline: '',
    keywords: '',
    impactFactor: '',
    citations: 0,
  });

  const filteredPapers = papers.filter((p) => {
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.conferenceJournal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.keywords || []).some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const handleOpenEdit = (paper) => {
    setEditPaper(paper);
    setEditFormData({
      title: paper.title,
      abstract: paper.abstract,
      conferenceJournal: paper.conferenceJournal,
      authors: (paper.authors || []).join(', '),
      submissionDate: paper.submissionDate ? new Date(paper.submissionDate).toISOString().split('T')[0] : '',
      doi: paper.doi || '',
      paperUrl: paper.paperUrl || '',
      status: paper.status || 'Draft',
      conferenceDeadline: paper.conferenceDeadline
        ? new Date(paper.conferenceDeadline).toISOString().split('T')[0]
        : '',
      keywords: (paper.keywords || []).join(', '),
      impactFactor: paper.impactFactor || '',
      citations: paper.citations || 0,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await researchAPI.update(editPaper._id, editFormData);
      toast.success('Research paper updated successfully!');
      setEditPaper(null);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update research paper.');
    }
  };

  const handleDelete = async () => {
    if (!deletePaperId) return;
    try {
      await researchAPI.delete(deletePaperId);
      toast.success('Research paper removed.');
      setDeletePaperId(null);
      onRefresh();
    } catch (err) {
      toast.error('Failed to delete paper.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return <span className="badge badge-success">● Published</span>;
      case 'Accepted':
        return <span className="badge badge-gold">● Accepted</span>;
      case 'Under Review':
        return <span className="badge badge-warning">● Under Review</span>;
      case 'Submitted':
        return <span className="badge badge-info">● Submitted</span>;
      case 'Rejected':
        return <span className="badge badge-danger">● Rejected</span>;
      default:
        return <span className="badge badge-secondary">● Draft</span>;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="filter-bar">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Research & Scientific Publications</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Track academic manuscripts, journal papers, conference peer reviews, and citations.
          </p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>New Research Paper</span>
        </button>
      </div>

      {/* Publication Status Pipeline Metric Bar */}
      <div
        className="glass-panel"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          padding: '16px 20px',
          gap: 12,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        {[
          { label: 'Draft', count: statusCounts.Draft || 0, color: 'var(--text-muted)' },
          { label: 'Submitted', count: statusCounts.Submitted || 0, color: 'var(--status-info)' },
          { label: 'Under Review', count: statusCounts['Under Review'] || 0, color: 'var(--status-warning)' },
          { label: 'Accepted', count: statusCounts.Accepted || 0, color: 'var(--gold-bright)' },
          { label: 'Published', count: statusCounts.Published || 0, color: 'var(--status-success)' },
          { label: 'Rejected', count: statusCounts.Rejected || 0, color: 'var(--status-danger)' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer',
              border: statusFilter === item.label ? `1px solid ${item.color}` : '1px solid transparent',
            }}
            onClick={() => setStatusFilter(statusFilter === item.label ? 'All' : item.label)}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: item.color, fontFamily: 'var(--font-heading)' }}>
              {item.count}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs & Search */}
      <div
        className="glass-panel"
        style={{
          padding: '12px 18px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div className="pill-tabs">
          {['All', 'Published', 'Accepted', 'Under Review', 'Submitted', 'Draft'].map((st) => (
            <button
              key={st}
              className={`pill-tab ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 260 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 32, padding: '7px 12px 7px 32px', fontSize: 12.5 }}
            placeholder="Search papers, DOI, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Papers List */}
      {filteredPapers.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredPapers.map((paper) => {
            const isExpanded = expandedAbstractId === paper._id;
            return (
              <div key={paper._id} className="glass-panel glass-panel-interactive research-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      {getStatusBadge(paper.status)}
                      <span className="badge badge-purple" style={{ fontSize: 11 }}>
                        {paper.conferenceJournal}
                      </span>
                      {paper.citations > 0 && (
                        <span className="badge badge-gold" style={{ fontSize: 11 }}>
                          ★ {paper.citations} Citations
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {paper.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn-icon btn-secondary btn-sm"
                      style={{ width: 30, height: 30 }}
                      onClick={() => handleOpenEdit(paper)}
                      title="Edit Paper"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="btn-icon btn-danger btn-sm"
                      style={{ width: 30, height: 30 }}
                      onClick={() => setDeletePaperId(paper._id)}
                      title="Delete Paper"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Abstract */}
                <div style={{ marginBottom: 14 }}>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      ...(isExpanded
                        ? {}
                        : {
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }),
                    }}
                  >
                    <strong style={{ color: 'var(--gold-bright)' }}>Abstract: </strong>
                    {paper.abstract}
                  </p>
                  <button
                    onClick={() => setExpandedAbstractId(isExpanded ? null : paper._id)}
                    style={{ fontSize: 11.5, color: 'var(--gold-bright)', fontWeight: 600, marginTop: 4 }}
                  >
                    {isExpanded ? 'Show Less' : 'Read Full Abstract'}
                  </button>
                </div>

                {/* Authors & Keywords */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <Users size={14} color="var(--gold-bright)" />
                    <span>Authors: {(paper.authors || []).join(', ')}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(paper.keywords || []).map((kw, i) => (
                      <span key={i} className="tech-tag" style={{ color: 'var(--gold-bright)' }}>
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Links & Dates */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 12,
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: 12,
                    color: 'var(--text-muted)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar size={13} />
                      Submitted: {new Date(paper.submissionDate).toLocaleDateString()}
                    </span>
                    {paper.conferenceDeadline && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--status-warning)' }}>
                        <Clock size={13} />
                        Deadline: {new Date(paper.conferenceDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    {paper.doi && (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-gold btn-sm"
                        style={{ padding: '3px 8px', fontSize: 11 }}
                      >
                        <ExternalLink size={12} />
                        <span>DOI: {paper.doi}</span>
                      </a>
                    )}
                    {paper.paperUrl && (
                      <a
                        href={paper.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '3px 8px', fontSize: 11 }}
                      >
                        <FileText size={12} />
                        <span>ArXiv / PDF</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookMarked}
          title="No research papers found"
          description="Record your academic publications, research drafts, and conference submissions."
          actionText="+ Add Research Paper"
          onAction={onOpenAddModal}
        />
      )}

      {/* EDIT MODAL */}
      <Modal
        isOpen={!!editPaper}
        onClose={() => setEditPaper(null)}
        title="Edit Research Paper"
        subtitle={`Updating ${editFormData.title}`}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Paper Title *</label>
            <input
              type="text"
              className="form-input"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Abstract *</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: 100 }}
              value={editFormData.abstract}
              onChange={(e) => setEditFormData({ ...editFormData, abstract: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Target Conference / Journal *</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.conferenceJournal}
                onChange={(e) => setEditFormData({ ...editFormData, conferenceJournal: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Publication Status</label>
              <select
                className="form-select"
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              >
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Accepted">Accepted</option>
                <option value="Published">Published</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Authors (comma separated)</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.authors}
                onChange={(e) => setEditFormData({ ...editFormData, authors: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Keywords (comma separated)</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.keywords}
                onChange={(e) => setEditFormData({ ...editFormData, keywords: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Digital Object Identifier (DOI)</label>
              <input
                type="text"
                className="form-input"
                placeholder="10.1109/TNNLS.2025..."
                value={editFormData.doi}
                onChange={(e) => setEditFormData({ ...editFormData, doi: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Paper / ArXiv URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://arxiv.org/abs/..."
                value={editFormData.paperUrl}
                onChange={(e) => setEditFormData({ ...editFormData, paperUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditPaper(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-gold btn-sm">
              Save Paper
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE DIALOG */}
      <ConfirmDialog
        isOpen={!!deletePaperId}
        onClose={() => setDeletePaperId(null)}
        onConfirm={handleDelete}
        title="Delete Research Paper"
        message="Are you sure you want to delete this manuscript entry from your research archive?"
        confirmText="Delete Paper"
      />
    </div>
  );
};
