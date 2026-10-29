import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  BookOpen,
  Filter,
  CheckSquare
} from 'lucide-react';
import { Modal, ConfirmDialog, EmptyState } from '../common/CommonModals';
import { useToast } from '../../context/ToastContext';
import { deadlineAPI } from '../../services/api';

export const DeadlinesView = ({
  deadlines = [],
  subjects = [],
  onRefresh,
  onOpenAddModal,
  onToggleDeadline,
}) => {
  const toast = useToast();

  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteDeadlineId, setDeleteDeadlineId] = useState(null);

  const filteredDeadlines = deadlines.filter((d) => {
    const matchPriority = priorityFilter === 'All' || d.priority === priorityFilter;
    const matchType = typeFilter === 'All' || d.type === typeFilter;
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchPriority && matchType && matchStatus;
  });

  const getDaysLeft = (dueDate) => {
    const diffTime = new Date(dueDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true };
    if (diffDays === 0) return { text: 'Due today', isToday: true };
    if (diffDays === 1) return { text: 'Due tomorrow', isNear: true };
    return { text: `Due in ${diffDays} days`, isNear: diffDays <= 3 };
  };

  const handleDelete = async () => {
    if (!deleteDeadlineId) return;
    try {
      await deadlineAPI.delete(deleteDeadlineId);
      toast.success('Deadline removed.');
      setDeleteDeadlineId(null);
      onRefresh();
    } catch (err) {
      toast.error('Failed to delete deadline.');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="filter-bar">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Academic Deadlines & Schedule</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Manage submission dates, exam timetables, project deliverables, and conference deadlines.
          </p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add Deadline</span>
        </button>
      </div>

      {/* Filter Bar */}
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
          {['All', 'Pending', 'Completed'].map((st) => (
            <button
              key={st}
              className={`pill-tab ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Priority Filter */}
          <select
            className="form-select"
            style={{ width: 140, padding: '7px 10px', fontSize: 12.5 }}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Type Filter */}
          <select
            className="form-select"
            style={{ width: 160, padding: '7px 10px', fontSize: 12.5 }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Assignment">Assignment</option>
            <option value="Exam">Exam</option>
            <option value="Project Milestone">Project Milestone</option>
            <option value="Conference">Conference</option>
            <option value="Hackathon">Hackathon</option>
          </select>
        </div>
      </div>

      {/* Deadlines List */}
      {filteredDeadlines.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredDeadlines.map((d) => {
            const countdown = getDaysLeft(d.dueDate);
            const isCompleted = d.status === 'Completed';

            return (
              <div
                key={d._id}
                className="glass-panel glass-panel-interactive"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  opacity: isCompleted ? 0.6 : 1,
                  background: isCompleted ? 'rgba(0,0,0,0.3)' : 'var(--bg-glass)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleDeadline(d._id)}
                    style={{
                      width: 20,
                      height: 20,
                      accentColor: 'var(--gold-bright)',
                      cursor: 'pointer',
                    }}
                  />

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                      }}
                    >
                      {d.title}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                      <strong style={{ color: 'var(--gold-bright)' }}>{d.subjectName}</strong> • Type: {d.type}
                      {d.description ? ` • ${d.description}` : ''}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Countdown pill */}
                  {!isCompleted && (
                    <span
                      className={`badge ${
                        countdown.isOverdue
                          ? 'badge-danger'
                          : countdown.isNear || countdown.isToday
                          ? 'badge-warning'
                          : 'badge-gold'
                      }`}
                      style={{ fontSize: 12, padding: '5px 12px' }}
                    >
                      <Clock size={13} />
                      {countdown.text}
                    </span>
                  )}

                  {/* Priority */}
                  <span
                    className={`badge ${
                      d.priority === 'Critical'
                        ? 'badge-danger'
                        : d.priority === 'High'
                        ? 'badge-warning'
                        : 'badge-info'
                    }`}
                    style={{ fontSize: 11 }}
                  >
                    {d.priority}
                  </span>

                  {/* Delete Button */}
                  <button
                    className="btn-icon btn-danger btn-sm"
                    style={{ width: 28, height: 28 }}
                    onClick={() => setDeleteDeadlineId(d._id)}
                    title="Delete Deadline"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={CalendarIcon}
          title="No deadlines found"
          description="Schedule upcoming assignment submissions, lab practicals, or research deadlines."
          actionText="+ Schedule Deadline"
          onAction={onOpenAddModal}
        />
      )}

      {/* DELETE DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteDeadlineId}
        onClose={() => setDeleteDeadlineId(null)}
        onConfirm={handleDelete}
        title="Delete Deadline"
        message="Are you sure you want to delete this scheduled deadline?"
        confirmText="Delete Deadline"
      />
    </div>
  );
};
