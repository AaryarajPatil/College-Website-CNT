import React, { useState } from 'react';
import {
  Activity,
  FolderGit2,
  BookMarked,
  Trophy,
  BookOpen,
  CheckCircle2,
  Calendar,
  Sparkles,
  Filter
} from 'lucide-react';
import { EmptyState } from '../common/CommonModals';

export const TimelineView = ({ activities = [] }) => {
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredActivities = activities.filter((act) => {
    if (categoryFilter === 'All') return true;
    return act.category === categoryFilter;
  });

  const getEventIcon = (type) => {
    switch (type) {
      case 'project_created':
      case 'project_completed':
        return <FolderGit2 size={14} color="var(--gold-bright)" />;
      case 'paper_submitted':
      case 'paper_accepted':
      case 'paper_published':
        return <BookMarked size={14} color="var(--status-info)" />;
      case 'achievement_earned':
        return <Trophy size={14} color="#F59E0B" />;
      case 'subject_enrolled':
        return <BookOpen size={14} color="var(--status-purple)" />;
      case 'deadline_cleared':
        return <CheckCircle2 size={14} color="var(--status-success)" />;
      default:
        return <Sparkles size={14} color="var(--gold-bright)" />;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="filter-bar">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Student Activity Timeline</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Verifiable chronological journal of project milestones, scientific contributions, and academic awards.
          </p>
        </div>

        <div className="pill-tabs">
          {['All', 'Projects', 'Research', 'Achievements', 'Academic', 'Deadlines'].map((cat) => (
            <button
              key={cat}
              className={`pill-tab ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Feed */}
      {filteredActivities.length > 0 ? (
        <div className="glass-panel" style={{ padding: '32px 28px' }}>
          <div className="timeline-list">
            {filteredActivities.map((act) => (
              <div key={act._id} className="timeline-item">
                <div className="timeline-dot">
                  {getEventIcon(act.type)}
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="badge badge-gold" style={{ fontSize: 11 }}>
                        {act.category || 'General'}
                      </span>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {act.title}
                      </h4>
                    </div>

                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--gold-bright)',
                        fontFamily: 'var(--font-mono)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Calendar size={13} />
                      {new Date(act.timestamp || act.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Activity}
          title="No timeline events in this category"
          description="Activities are automatically logged as you create projects, submit research papers, and achieve milestones."
        />
      )}
    </div>
  );
};
