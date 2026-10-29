import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  Briefcase,
  Code,
  CheckCircle,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Search
} from 'lucide-react';
import { Modal, ConfirmDialog, EmptyState } from '../common/CommonModals';
import { useToast } from '../../context/ToastContext';
import { achievementAPI } from '../../services/api';

export const AchievementsView = ({
  achievements = [],
  categoryStats = {},
  onRefresh,
  onOpenAddModal,
}) => {
  const toast = useToast();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [editAchievement, setEditAchievement] = useState(null);
  const [deleteAchievementId, setDeleteAchievementId] = useState(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: 'Certifications',
    organization: '',
    issueDate: '',
    description: '',
    credentialUrl: '',
    badgeIcon: 'Award',
    skills: '',
  });

  const categories = [
    'All',
    'Certifications',
    'Hackathons',
    'Competitions',
    'Awards',
    'Internships',
    'Workshops',
  ];

  const filteredAchievements = achievements.filter((a) => {
    const matchCat = categoryFilter === 'All' || a.category === categoryFilter;
    const matchSearch =
      !searchTerm ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.skills || []).some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Hackathons':
        return <Trophy size={18} color="var(--gold-bright)" />;
      case 'Internships':
        return <Briefcase size={18} color="var(--status-info)" />;
      case 'Awards':
        return <Award size={18} color="var(--gold-bright)" />;
      case 'Competitions':
        return <Code size={18} color="var(--status-purple)" />;
      default:
        return <Sparkles size={18} color="var(--gold-bright)" />;
    }
  };

  const handleOpenEdit = (ach) => {
    setEditAchievement(ach);
    setEditFormData({
      title: ach.title,
      category: ach.category || 'Certifications',
      organization: ach.organization,
      issueDate: ach.issueDate ? new Date(ach.issueDate).toISOString().split('T')[0] : '',
      description: ach.description || '',
      credentialUrl: ach.credentialUrl || '',
      badgeIcon: ach.badgeIcon || 'Award',
      skills: (ach.skills || []).join(', '),
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await achievementAPI.update(editAchievement._id, editFormData);
      toast.success('Achievement updated successfully!');
      setEditAchievement(null);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update achievement.');
    }
  };

  const handleDelete = async () => {
    if (!deleteAchievementId) return;
    try {
      await achievementAPI.delete(deleteAchievementId);
      toast.success('Achievement removed.');
      setDeleteAchievementId(null);
      onRefresh();
    } catch (err) {
      toast.error('Failed to delete achievement.');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="filter-bar">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Honors, Certifications & Achievements</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Showcase verified credentials, hackathon victories, corporate internships, and academic awards.
          </p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* Category Pills & Search */}
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
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill-tab ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
              {cat !== 'All' && categoryStats[cat] ? ` (${categoryStats[cat]})` : ''}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 240 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 32, padding: '7px 12px 7px 32px', fontSize: 12.5 }}
            placeholder="Search credential or issuer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Achievements */}
      {filteredAchievements.length > 0 ? (
        <div className="grid-cols-2">
          {filteredAchievements.map((ach) => (
            <div
              key={ach._id}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                background: 'linear-gradient(135deg, rgba(20, 20, 26, 0.8) 0%, rgba(30, 24, 12, 0.4) 100%)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getCategoryIcon(ach.category)}
                    </div>
                    <div>
                      <span className="badge badge-gold" style={{ fontSize: 11 }}>
                        {ach.category}
                      </span>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {ach.organization}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn-icon btn-secondary btn-sm"
                      style={{ width: 28, height: 28 }}
                      onClick={() => handleOpenEdit(ach)}
                      title="Edit Achievement"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="btn-icon btn-danger btn-sm"
                      style={{ width: 28, height: 28 }}
                      onClick={() => setDeleteAchievementId(ach._id)}
                      title="Delete Achievement"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {ach.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                  {ach.description}
                </p>

                {/* Skills tags */}
                {ach.skills && ach.skills.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {ach.skills.map((s, idx) => (
                      <span key={idx} className="tech-tag" style={{ color: 'var(--gold-bright)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer with Issue date & Credential Link */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 12,
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: 12,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
                  <Calendar size={13} />
                  {new Date(ach.issueDate).toLocaleDateString(undefined, {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                {ach.credentialUrl && (
                  <a
                    href={ach.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-gold btn-sm"
                    style={{ padding: '3px 10px', fontSize: 11 }}
                  >
                    <ExternalLink size={12} />
                    <span>Verify Credential</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No achievements in this category"
          description="Add certifications, hackathon awards, or competition recognitions to build your track record."
          actionText="+ Add Achievement"
          onAction={onOpenAddModal}
        />
      )}

      {/* EDIT MODAL */}
      <Modal
        isOpen={!!editAchievement}
        onClose={() => setEditAchievement(null)}
        title="Edit Academic Achievement"
        subtitle={`Updating ${editFormData.title}`}
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Achievement Title *</label>
            <input
              type="text"
              className="form-input"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={editFormData.category}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
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
                value={editFormData.organization}
                onChange={(e) => setEditFormData({ ...editFormData, organization: e.target.value })}
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
                value={editFormData.issueDate}
                onChange={(e) => setEditFormData({ ...editFormData, issueDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Credential / Verification URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={editFormData.credentialUrl}
                onChange={(e) => setEditFormData({ ...editFormData, credentialUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills Acquired (comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="PyTorch, Cloud Architecture, Leadership"
              value={editFormData.skills}
              onChange={(e) => setEditFormData({ ...editFormData, skills: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Summary of Honors</label>
            <textarea
              className="form-textarea"
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditAchievement(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-gold btn-sm">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteAchievementId}
        onClose={() => setDeleteAchievementId(null)}
        onConfirm={handleDelete}
        title="Delete Achievement"
        message="Are you sure you want to delete this achievement from your profile?"
        confirmText="Delete Achievement"
      />
    </div>
  );
};
