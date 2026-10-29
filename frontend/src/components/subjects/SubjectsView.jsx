import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  User,
  GraduationCap,
  FolderGit2,
  CheckCircle,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { Modal, ConfirmDialog, EmptyState } from '../common/CommonModals';
import { useToast } from '../../context/ToastContext';
import { subjectAPI } from '../../services/api';

export const SubjectsView = ({
  subjects = [],
  onRefresh,
  onOpenAddModal,
  onNavigateToProjectsWithSubject,
}) => {
  const toast = useToast();

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [detailSubjectData, setDetailSubjectData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [editSubject, setEditSubject] = useState(null);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 4,
    professor: '',
    attendanceRate: 90,
    semester: 7,
    colorTag: '#D4AF37',
    description: '',
  });

  const handleOpenDetail = async (subject) => {
    setSelectedSubject(subject);
    setIsDetailLoading(true);
    try {
      const res = await subjectAPI.getById(subject._id);
      if (res.data.success) {
        setDetailSubjectData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load subject details.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleOpenEdit = (subject, e) => {
    e.stopPropagation();
    setEditSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      credits: subject.credits || 4,
      professor: subject.professor || '',
      attendanceRate: subject.attendanceRate || 90,
      semester: subject.semester || 7,
      colorTag: subject.colorTag || '#D4AF37',
      description: subject.description || '',
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await subjectAPI.update(editSubject._id, formData);
      toast.success('Subject updated successfully!');
      setEditSubject(null);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update subject.');
    }
  };

  const handleDelete = async () => {
    if (!deleteSubjectId) return;
    try {
      await subjectAPI.delete(deleteSubjectId);
      toast.success('Subject removed successfully.');
      setDeleteSubjectId(null);
      onRefresh();
    } catch (err) {
      toast.error('Failed to delete subject.');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="filter-bar">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Academic Subjects</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Manage course curriculum, professor contacts, attendance, and linked engineering projects.
          </p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Grid of Subjects */}
      {subjects.length > 0 ? (
        <div className="grid-cols-3">
          {subjects.map((sub) => (
            <div
              key={sub._id}
              className="glass-panel glass-panel-interactive subject-card cursor-pointer"
              style={{ borderLeftColor: sub.colorTag || 'var(--gold-primary)' }}
              onClick={() => handleOpenDetail(sub)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div className="subject-code">{sub.code}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{sub.name}</h3>
                </div>
                <div
                  className="attendance-gauge"
                  style={{
                    borderColor: sub.attendanceRate >= 85 ? 'var(--status-success)' : 'var(--status-warning)',
                    color: sub.attendanceRate >= 85 ? '#34D399' : '#FBBF24',
                  }}
                  title="Attendance Percentage"
                >
                  {sub.attendanceRate}%
                </div>
              </div>

              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 16, minHeight: 38, lineClamp: 2 }}>
                {sub.description || 'Core engineering subject covering foundational theory, design, and practical labs.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <User size={14} color="var(--gold-bright)" />
                  <span>{sub.professor || 'Department Faculty'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <GraduationCap size={14} color="var(--gold-bright)" />
                  <span>{sub.credits} Academic Credits • Sem {sub.semester}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 14,
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FolderGit2 size={15} color="var(--gold-bright)" />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {sub.projectCount || 0} Linked {sub.projectCount === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn-icon btn-secondary btn-sm"
                    style={{ width: 28, height: 28 }}
                    onClick={(e) => handleOpenEdit(sub, e)}
                    title="Edit Subject"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    className="btn-icon btn-danger btn-sm"
                    style={{ width: 28, height: 28 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteSubjectId(sub._id);
                    }}
                    title="Delete Subject"
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
          icon={BookOpen}
          title="No subjects enrolled yet"
          description="Add your first college course to organize assignments, track attendance, and link projects."
          actionText="+ Add First Subject"
          onAction={onOpenAddModal}
        />
      )}

      {/* DETAIL MODAL: Shows Subject + Assigned Projects + Syllabus */}
      <Modal
        isOpen={!!selectedSubject}
        onClose={() => {
          setSelectedSubject(null);
          setDetailSubjectData(null);
        }}
        title={selectedSubject ? `${selectedSubject.name} (${selectedSubject.code})` : ''}
        subtitle={`Semester ${selectedSubject?.semester} • ${selectedSubject?.credits} Credits • Faculty: ${selectedSubject?.professor}`}
        maxWidth="680px"
      >
        {isDetailLoading ? (
          <div style={{ padding: '30px 0', textAlign: 'center' }}>Loading subject syllabus and projects...</div>
        ) : (
          <div>
            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold-bright)', marginBottom: 6 }}>Course Overview</h4>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {detailSubjectData?.description || 'Foundational curriculum and practical development course.'}
              </p>
            </div>

            {/* Syllabus Topics Checklist */}
            {detailSubjectData?.syllabusTopics && detailSubjectData.syllabusTopics.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold-bright)', marginBottom: 10 }}>
                  Curriculum & Syllabus Progress
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {detailSubjectData.syllabusTopics.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: 13,
                      }}
                    >
                      <CheckCircle
                        size={16}
                        color={item.isCompleted ? 'var(--status-success)' : 'var(--text-muted)'}
                      />
                      <span style={{ color: item.isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {item.topic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Linked Projects */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold-bright)' }}>
                  Assigned Student Projects ({detailSubjectData?.projects?.length || 0})
                </h4>
              </div>

              {detailSubjectData?.projects && detailSubjectData.projects.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {detailSubjectData.projects.map((proj) => (
                    <div
                      key={proj._id}
                      style={{
                        padding: '12px 16px',
                        background: 'var(--bg-surface)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                          {proj.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                          Status: <strong style={{ color: 'var(--gold-bright)' }}>{proj.status}</strong> •{' '}
                          {proj.progress}% Completed
                        </div>
                      </div>
                      <span className="badge badge-gold" style={{ fontSize: 11 }}>
                        {proj.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '12px 0' }}>
                  No projects linked to this subject yet.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={!!editSubject}
        onClose={() => setEditSubject(null)}
        title="Edit Academic Subject"
        subtitle={`Updating ${formData.name}`}
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Subject Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Subject Code *</label>
              <input
                type="text"
                className="form-input"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Credits *</label>
              <input
                type="number"
                min="1"
                max="8"
                className="form-input"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Faculty / Professor</label>
              <input
                type="text"
                className="form-input"
                value={formData.professor}
                onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Attendance Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="form-input"
                value={formData.attendanceRate}
                onChange={(e) => setFormData({ ...formData, attendanceRate: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Course Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditSubject(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-gold btn-sm">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteSubjectId}
        onClose={() => setDeleteSubjectId(null)}
        onConfirm={handleDelete}
        title="Delete Subject"
        message="Are you sure you want to delete this subject? Linked projects will remain in your portfolio but unlinked from this subject."
        confirmText="Delete Subject"
      />
    </div>
  );
};
