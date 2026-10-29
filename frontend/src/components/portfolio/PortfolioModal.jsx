import React from 'react';
import {
  Sparkles,
  Printer,
  X,
  Code2,
  Share2,
  Mail,
  FolderGit2,
  BookMarked,
  Trophy,
  GraduationCap,
  Award,
  Layers,
  Star,
  TrendingUp,
  ShieldCheck,
  Gem
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PortfolioModal = ({ isOpen, onClose, subjects = [], projects = [], papers = [], achievements = [] }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  const handlePrint = () => window.print();

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        style={{
          maxWidth: '920px',
          maxHeight: '92vh',
          padding: 0,
          background: 'var(--bg-glass-modal)',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          boxShadow: 'var(--shadow-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 26px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.22)',
            background: 'rgba(12, 12, 18, 0.98)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="brand-logo-icon" style={{ width: 30, height: 30, fontSize: 13 }}>VP</div>
            <div>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>
                VIERP Premium Academic Portfolio
              </span>
              <div style={{ fontSize: 11, color: 'var(--gold-bright)' }}>
                Certified Student Resume & Project Showcase
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-gold btn-sm" onClick={handlePrint} style={{ gap: 5 }}>
              <Printer size={13} /> Export PDF / Print
            </button>
            <button className="btn-icon btn-secondary btn-sm" onClick={onClose} style={{ width: 32, height: 32 }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div style={{ padding: '34px 44px', overflowY: 'auto' }} className="print-area">
          {/* Header Profile Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              paddingBottom: 26,
              borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
              marginBottom: 28,
            }}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={user?.name}
              style={{
                width: 95,
                height: 95,
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                border: '2px solid var(--gold-primary)',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span className="badge badge-gold" style={{ fontWeight: 800 }}>
                  <Gem size={11} /> {user?.branch || 'Computer Science & Engineering'}
                </span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  Semester {user?.semester || 7}
                </span>
                <span className="badge badge-gold" style={{ background: 'var(--gold-gradient)', color: '#080705', fontWeight: 800 }}>
                  Dean's List #1
                </span>
              </div>

              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#ffffff' }}>{user?.name || 'Aryan Sharma'}</h1>
              <p style={{ fontSize: 14, color: 'var(--gold-bright)', fontWeight: 700, marginTop: 1 }}>
                {user?.specialization || 'B.Tech Computer Science & Engineering (AI & ML)'}
              </p>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>
                Roll: <strong style={{ color: '#fff' }}>{user?.rollNumber || '21BCE10482'}</strong> •{' '}
                CGPA: <strong style={{ color: 'var(--gold-bright)', fontSize: 15 }}>{user?.cgpa || 9.34}</strong> / 10.0 •{' '}
                Department Rank #1
              </p>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.55 }}>
                {user?.bio || 'AI/ML systems researcher & software architect specializing in deep learning, distributed systems and production cloud infrastructure.'}
              </p>

              {/* Links */}
              <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap', fontSize: 12.5 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
                  <Mail size={13} color="var(--gold-bright)" /> {user?.email || 'aryan.sharma@vierp.edu'}
                </span>
                {user?.socialLinks?.github && (
                  <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold-bright)' }}>
                    <Code2 size={13} /> GitHub Profile
                  </a>
                )}
                {user?.socialLinks?.linkedin && (
                  <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold-bright)' }}>
                    <Share2 size={13} /> LinkedIn
                  </a>
                )}
                {user?.socialLinks?.scholar && (
                  <a href={user.socialLinks.scholar} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold-bright)' }}>
                    <BookMarked size={13} /> Google Scholar
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Research Publications */}
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold-bright)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: 6 }}>
              <BookMarked size={16} /> Research Publications ({papers.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {papers.length > 0 ? (
                papers.map((p) => (
                  <div
                    key={p._id}
                    style={{
                      padding: '14px 18px',
                      background: 'rgba(212, 175, 55, 0.06)',
                      border: '1px solid rgba(212, 175, 55, 0.22)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{p.title}</span>
                      <span className="badge badge-gold" style={{ fontSize: 10 }}>{p.status}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--gold-bright)', fontWeight: 600, marginBottom: 2 }}>
                      {p.conferenceJournal} {p.citations ? `• ${p.citations} citations` : ''}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {(p.authors || []).join(', ')}
                    </div>
                    {p.doi && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>DOI: {p.doi}</div>}
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>No publications recorded.</p>
              )}
            </div>
          </div>

          {/* Software & Engineering Projects */}
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold-bright)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: 6 }}>
              <FolderGit2 size={16} /> Software & Engineering Projects ({projects.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {projects.map((proj) => (
                <div
                  key={proj._id}
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(212, 175, 55, 0.06)',
                    border: '1px solid rgba(212, 175, 55, 0.22)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{proj.title}</span>
                    <span className="badge badge-success" style={{ fontSize: 10 }}>{proj.status}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: 8 }}>{proj.description}</p>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {(proj.technologies || []).slice(0, 4).map((t, idx) => (
                      <span key={idx} className="tech-tag" style={{ fontSize: 10.5 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Honors & Certifications */}
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold-bright)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: 6 }}>
              <Trophy size={16} /> Honors & Distinctions ({achievements.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {achievements.map((ach) => (
                <div
                  key={ach._id}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(212, 175, 55, 0.06)',
                    border: '1px solid rgba(212, 175, 55, 0.22)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#ffffff' }}>{ach.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gold-bright)', marginTop: 2, fontWeight: 600 }}>
                    {ach.organization} • {ach.category}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coursework */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold-bright)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: 6 }}>
              <GraduationCap size={16} /> Core Coursework ({subjects.length} Courses)
            </h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {subjects.map((sub) => (
                <span key={sub._id} className="badge badge-gold" style={{ fontSize: 11.5, padding: '5px 12px', fontFamily: 'var(--font-mono)' }}>
                  {sub.name} ({sub.code}) • {sub.credits}cr
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
