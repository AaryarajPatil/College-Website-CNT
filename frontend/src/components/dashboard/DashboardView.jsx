import React, { useState } from 'react';
import {
  GraduationCap,
  FolderGit2,
  BookMarked,
  Trophy,
  Clock,
  Activity,
  TrendingUp,
  ChevronRight,
  Plus,
  Star,
  Sparkles,
  Award,
  Layers,
  ExternalLink,
  Code2,
  Globe,
  Users,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  UserCheck,
  BookmarkCheck,
  ShieldCheck,
  ArrowUpRight,
  Gem,
  Crown
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

export const DashboardView = ({
  dashboardData,
  projects = [],
  subjects = [],
  researchData = { papers: [] },
  achievementsData = { achievements: [] },
  deadlines: propDeadlines,
  activities: propActivities,
  onNavigate,
  onOpenQuickAction,
  onToggleDeadline,
  onOpenPortfolio,
  onOpenProfile,
}) => {
  const { user } = useAuth();

  const metrics = dashboardData?.metrics || {};
  const charts = dashboardData?.charts || {};
  const upcomingDeadlines = propDeadlines || dashboardData?.upcomingDeadlines || [];
  const recentActivities = propActivities || dashboardData?.recentActivities || [];
  const allProjects = projects.length > 0 ? projects : (dashboardData?.projects || []);
  const allPapers = researchData?.papers?.length > 0 ? researchData.papers : (dashboardData?.papers || []);

  const [projectStatusFilter, setProjectStatusFilter] = useState('All');

  // Filter projects by status
  const filteredProjects = allProjects.filter((p) => {
    if (projectStatusFilter === 'All') return true;
    return p.status === projectStatusFilter;
  });

  // Chart: 24K Gold Area Line Chart for CGPA Progression
  const gpaLabels = (charts.cgpaTrend || []).map((c) => c.semester);
  const gpaValues = (charts.cgpaTrend || []).map((c) => c.gpa);

  const gpaChartData = {
    labels: gpaLabels.length ? gpaLabels : ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7'],
    datasets: [
      {
        label: 'CGPA',
        data: gpaValues.length ? gpaValues : [8.8, 9.0, 9.15, 9.22, 9.45, 9.38, 9.34],
        fill: true,
        borderColor: '#f5d478',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 220);
          gradient.addColorStop(0, 'rgba(245, 212, 120, 0.35)');
          gradient.addColorStop(0.6, 'rgba(212, 175, 55, 0.08)');
          gradient.addColorStop(1, 'rgba(212, 175, 55, 0.0)');
          return gradient;
        },
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: '#ffd700',
        pointBorderColor: '#07070a',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0e0e14',
        titleColor: '#ffffff',
        bodyColor: '#f5d478',
        borderColor: 'rgba(212, 175, 55, 0.6)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: { label: (ctx) => `GPA: ${ctx.parsed.y} / 10.0` },
      },
    },
    scales: {
      y: {
        min: 8.0,
        max: 10.0,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#6b665c', font: { family: 'Plus Jakarta Sans', size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6b665c', font: { family: 'Plus Jakarta Sans', size: 11 } },
      },
    },
  };

  // Chart: Project Breakdown Doughnut
  const doughnutData = {
    labels: ['Completed', 'In Progress', 'Idea/Plan'],
    datasets: [
      {
        data: [
          charts.projectStatusBreakdown?.Completed || 2,
          charts.projectStatusBreakdown?.['In Progress'] || 2,
          charts.projectStatusBreakdown?.Idea || 1,
        ],
        backgroundColor: ['#f5d478', '#8c6e1e', '#2c2c3a'],
        borderColor: '#0e0e14',
        borderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#aaa393',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#0e0e14',
        borderColor: 'rgba(212, 175, 55, 0.5)',
        borderWidth: 1,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="animate-fade-in">
      {/* 1. HERO / EXECUTIVE ACADEMIC IDENTITY CARD */}
      <section className="academic-identity-row" aria-label="Executive Student Identity">
        <div className="identity-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160'}
            alt={user?.name || 'Aryan Sharma'}
            className="identity-avatar"
          />
          <div className="identity-info">
            <div className="identity-title-row">
              <h1 className="identity-name">{user?.name || 'Aryan Sharma'}</h1>
              <span className="badge badge-gold">
                <Gem size={11} /> Executive Scholar
              </span>
              <span className="badge badge-gold" style={{ background: 'var(--gold-gradient)', color: '#080705', fontWeight: 800 }}>
                Dept. Rank #1
              </span>
            </div>

            <div className="identity-meta-row">
              <span>
                Roll: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{user?.rollNumber || '21BCE10482'}</strong>
              </span>
              <span>•</span>
              <span>{user?.branch || 'Computer Science & Engineering'}</span>
              <span>•</span>
              <span style={{ color: 'var(--gold-bright)', fontWeight: 700 }}>
                {user?.specialization || 'AI & Machine Learning'}
              </span>
              <span>•</span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: 11 }}>
                Semester {user?.semester || 7} (Year 4)
              </span>
            </div>
          </div>
        </div>

        <div className="identity-right">
          <div className="gpa-pill-widget">
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--gold-gradient-metallic)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#080705',
                boxShadow: '0 0 14px rgba(212, 175, 55, 0.45)',
                flexShrink: 0,
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <div className="gpa-pill-label">Cumulative GPA</div>
              <div className="gpa-pill-val">
                {user?.cgpa || 9.34}
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}> / 10.0</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--gold-bright)', fontSize: 11, fontWeight: 700, paddingLeft: 4 }}>
              <TrendingUp size={13} /> +0.12
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={onOpenProfile}>
              Edit Profile
            </button>
            <button className="btn btn-gold btn-sm" onClick={onOpenPortfolio}>
              <Sparkles size={13} /> Export CV
            </button>
          </div>
        </div>
      </section>

      {/* 2. ACADEMIC SNAPSHOT (INTEGRATED 5-COLUMN METRIC MATRIX) */}
      <section className="academic-snapshot-bar" aria-label="Academic Snapshot">
        {/* Segment 1: Semester Standing */}
        <div className="snapshot-segment cursor-pointer" onClick={() => onNavigate('subjects')}>
          <div className="snapshot-segment-header">
            <span>Semester 7</span>
            <GraduationCap size={14} color="var(--gold-bright)" />
          </div>
          <div className="snapshot-segment-value">
            {metrics.totalSubjects || 6} Courses <span className="snapshot-segment-sub">• {metrics.totalCredits || 22} Cr</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
            <span>Attendance: {metrics.avgAttendance || '91.7'}%</span>
            <span style={{ color: 'var(--gold-bright)', fontWeight: 700 }}>Dean's List</span>
          </div>
          <div className="micro-progress-bar">
            <div className="micro-progress-fill" style={{ width: `${Math.min(Number(metrics.avgAttendance || 91.7), 100)}%` }} />
          </div>
        </div>

        {/* Segment 2: Projects Pipeline */}
        <div className="snapshot-segment cursor-pointer" onClick={() => onNavigate('projects')}>
          <div className="snapshot-segment-header">
            <span>Project Pipeline</span>
            <FolderGit2 size={14} color="var(--status-info)" />
          </div>
          <div className="snapshot-segment-value">
            {metrics.totalProjects || 5} Repositories
          </div>
          <div className="snapshot-segment-sub" style={{ marginTop: 2 }}>
            <strong style={{ color: 'var(--gold-bright)' }}>{metrics.completedProjects || 2}</strong> Shipped •{' '}
            <strong style={{ color: 'var(--status-info)' }}>{metrics.inProgressProjects || 2}</strong> Active
          </div>
          <div className="micro-progress-bar">
            <div className="micro-progress-fill" style={{ width: '80%', background: 'var(--status-info)' }} />
          </div>
        </div>

        {/* Segment 3: Research Status */}
        <div className="snapshot-segment cursor-pointer" onClick={() => onNavigate('research')}>
          <div className="snapshot-segment-header">
            <span>Research & Pubs</span>
            <BookMarked size={14} color="var(--gold-bright)" />
          </div>
          <div className="snapshot-segment-value">
            {metrics.totalPapers || 4} Papers
          </div>
          <div className="snapshot-segment-sub" style={{ marginTop: 2 }}>
            <strong style={{ color: 'var(--gold-bright)' }}>1</strong> Published IEEE •{' '}
            <strong style={{ color: 'var(--status-success)' }}>1</strong> NeurIPS Accepted
          </div>
          <div className="micro-progress-bar">
            <div className="micro-progress-fill" style={{ width: '75%' }} />
          </div>
        </div>

        {/* Segment 4: Achievements */}
        <div className="snapshot-segment cursor-pointer" onClick={() => onNavigate('achievements')}>
          <div className="snapshot-segment-header">
            <span>Honors & Awards</span>
            <Trophy size={14} color="var(--gold-bright)" />
          </div>
          <div className="snapshot-segment-value">
            {metrics.totalAchievements || 6} Distinctions
          </div>
          <div className="snapshot-segment-sub" style={{ marginTop: 2, color: 'var(--gold-bright)', fontWeight: 700 }}>
            Global Hackathon Winner (1st)
          </div>
          <div className="micro-progress-bar">
            <div className="micro-progress-fill" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Segment 5: Critical Deadlines */}
        <div className="snapshot-segment cursor-pointer" onClick={() => onNavigate('deadlines')}>
          <div className="snapshot-segment-header">
            <span>Deadlines</span>
            <Clock size={14} color="var(--status-danger)" />
          </div>
          <div className="snapshot-segment-value">
            {upcomingDeadlines.length} Pending
          </div>
          <div className="snapshot-segment-sub" style={{ marginTop: 2, color: '#f87171', fontWeight: 700 }}>
            2 Critical Urgency (This Week)
          </div>
          <div className="micro-progress-bar">
            <div className="micro-progress-fill" style={{ width: '60%', background: 'var(--status-danger)' }} />
          </div>
        </div>
      </section>

      {/* 3. ASYMMETRIC 2-COLUMN EXECUTIVE WORKSPACE */}
      <div className="workspace-grid">
        {/* LEFT COLUMN: Projects Workspace, Analytics, Activity */}
        <div className="workspace-main-col">
          {/* SECTION: MY PROJECTS WORKSPACE */}
          <section className="workspace-card" style={{ padding: '20px 22px' }}>
            <div className="section-header">
              <div className="section-header-title">
                <FolderGit2 size={17} color="var(--gold-bright)" />
                <span>My Projects Workspace</span>
                <span className="badge badge-gold" style={{ fontSize: 11 }}>
                  {filteredProjects.length}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Status Filter Pills */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  {['All', 'In Progress', 'Completed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setProjectStatusFilter(st)}
                      style={{
                        padding: '4px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 'var(--radius-sm)',
                        background: projectStatusFilter === st ? 'var(--gold-gradient)' : 'transparent',
                        color: projectStatusFilter === st ? '#080705' : 'var(--text-secondary)',
                        boxShadow: projectStatusFilter === st ? '0 2px 8px rgba(212,175,55,0.35)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button className="btn btn-secondary btn-sm" onClick={() => onOpenQuickAction('project')}>
                  <Plus size={13} /> Add Project
                </button>
              </div>
            </div>

            {/* Horizontal Project Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredProjects.length > 0 ? (
                filteredProjects.slice(0, 4).map((proj) => (
                  <div key={proj._id} className="project-card-horizontal">
                    <div className="project-row-top">
                      <div className="project-title-group">
                        <span className="project-name-link">{proj.title}</span>
                        {proj.subjectName && (
                          <span className="badge" style={{ fontSize: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                            {proj.subjectName}
                          </span>
                        )}
                        {proj.featured && (
                          <span className="badge badge-gold" style={{ fontSize: 10 }}>
                            <Star size={10} /> Featured
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span
                          className={`badge ${
                            proj.status === 'Completed'
                              ? 'badge-success'
                              : proj.status === 'In Progress'
                              ? 'badge-gold'
                              : 'badge-secondary'
                          }`}
                          style={{ fontSize: 11 }}
                        >
                          {proj.status}
                        </span>

                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            title="Open GitHub"
                          >
                            <Code2 size={12} /> Code
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="project-desc-text">{proj.description}</p>

                    <div className="project-row-bottom">
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                        {(proj.technologies || []).slice(0, 4).map((t, idx) => (
                          <span key={idx} className="tech-tag">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {proj.progress !== undefined && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 90 }}>
                            <div className="micro-progress-bar" style={{ width: 60 }}>
                              <div
                                className="micro-progress-fill"
                                style={{
                                  width: `${proj.progress}%`,
                                  background: proj.progress === 100 ? 'var(--status-success)' : 'var(--gold-gradient)',
                                }}
                              />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--gold-bright)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                              {proj.progress}%
                            </span>
                          </div>
                        )}

                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {proj.duration || 'Semester 7'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                  No projects found under this filter.
                </div>
              )}
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('projects')}
              style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}
            >
              View All {allProjects.length} Projects in Workspace <ChevronRight size={13} />
            </button>
          </section>

          {/* SECTION: ACADEMIC INSIGHTS & PERFORMANCE TRAJECTORY */}
          <section className="workspace-card" style={{ padding: '20px 22px' }}>
            <div className="section-header">
              <div className="section-header-title">
                <TrendingUp size={17} color="var(--gold-bright)" />
                <span>Academic Insights & Trajectory</span>
              </div>
              <span className="badge badge-gold" style={{ fontSize: 11, fontWeight: 800 }}>
                CGPA: {user?.cgpa || 9.34} / 10.0
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'center' }}>
              {/* CGPA Curve */}
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Grade Point Trajectory across 7 Active Semesters
                </div>
                <div style={{ height: 180 }}>
                  <Line data={gpaChartData} options={lineChartOptions} />
                </div>
              </div>

              {/* Project Status Doughnut */}
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 18 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, textAlign: 'center' }}>
                  Project Pipeline Breakdown
                </div>
                <div style={{ height: 160 }}>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: AUDIT & ACTIVITY TIMELINE */}
          <section className="workspace-card" style={{ padding: '20px 22px' }}>
            <div className="section-header">
              <div className="section-header-title">
                <Activity size={17} color="var(--gold-bright)" />
                <span>Audit & Activity Log</span>
              </div>
              <span className="section-header-link" onClick={() => onNavigate('timeline')}>
                Full Timeline <ChevronRight size={13} />
              </span>
            </div>

            <div className="activity-timeline-clean">
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 5).map((act, idx) => (
                  <div key={act._id || idx} className="timeline-entry">
                    <div className="timeline-entry-dot">
                      <Sparkles size={9} color="var(--gold-bright)" />
                    </div>
                    <div>
                      <div className="timeline-entry-title">{act.title}</div>
                      <div className="timeline-entry-desc">{act.description}</div>
                      <div className="timeline-entry-time">
                        {new Date(act.timestamp || act.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>No recent activity records.</div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Deadlines, Research Status, Quick Actions */}
        <div className="workspace-side-col">
          {/* COMPACT UPCOMING DEADLINES WIDGET */}
          <section className="workspace-card" style={{ padding: '18px 20px' }}>
            <div className="section-header" style={{ marginBottom: 12 }}>
              <div className="section-header-title">
                <Clock size={16} color="#f87171" />
                <span>Upcoming Deadlines</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenQuickAction('deadline')}
                style={{ padding: '3px 8px', fontSize: 11 }}
              >
                <Plus size={12} /> Add
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.slice(0, 5).map((d) => (
                  <div
                    key={d._id}
                    className={`deadline-item-compact ${d.status === 'Completed' ? 'completed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={d.status === 'Completed'}
                      onChange={() => onToggleDeadline(d._id)}
                      style={{ marginTop: 2, accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#ffffff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {d.title}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 1 }}>
                        {d.subjectName || 'Coursework'} • {d.type}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span
                          className={`badge ${
                            d.priority === 'Critical'
                              ? 'badge-danger'
                              : d.priority === 'High'
                              ? 'badge-warning'
                              : 'badge-gold'
                          }`}
                          style={{ fontSize: 10, padding: '1px 6px' }}
                        >
                          {d.priority}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--gold-bright)', fontFamily: 'var(--font-mono)' }}>
                          {d.dueDate ? new Date(d.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Soon'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 12.5 }}>
                  No pending deadlines.
                </div>
              )}
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('deadlines')}
              style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}
            >
              Open Schedule <ChevronRight size={13} />
            </button>
          </section>

          {/* RESEARCH & PUBLICATION STATUS */}
          <section className="workspace-card" style={{ padding: '18px 20px' }}>
            <div className="section-header" style={{ marginBottom: 12 }}>
              <div className="section-header-title">
                <BookMarked size={16} color="var(--gold-bright)" />
                <span>Research Status</span>
              </div>
              <span className="section-header-link" onClick={() => onNavigate('research')}>
                All <ChevronRight size={12} />
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allPapers.length > 0 ? (
                allPapers.slice(0, 3).map((paper) => (
                  <div key={paper._id} className="research-row-compact">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: '#ffffff',
                          lineHeight: 1.35,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {paper.title}
                      </span>
                      <span
                        className={`badge ${
                          paper.status === 'Published'
                            ? 'badge-success'
                            : paper.status === 'Accepted'
                            ? 'badge-gold'
                            : 'badge-warning'
                        }`}
                        style={{ fontSize: 10, padding: '1px 6px', flexShrink: 0 }}
                      >
                        {paper.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gold-bright)', fontWeight: 600 }}>
                      {paper.conferenceJournal}
                    </div>
                    {paper.citations > 0 && (
                      <div style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
                        {paper.citations} citations recorded
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>No papers recorded.</div>
              )}
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onOpenQuickAction('research')}
              style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}
            >
              <Plus size={13} /> Add Publication
            </button>
          </section>

          {/* QUICK EXECUTIVE ACTION SUITE */}
          <section className="workspace-card" style={{ padding: '18px 20px' }}>
            <div className="section-header" style={{ marginBottom: 10 }}>
              <div className="section-header-title" style={{ fontSize: 13.5 }}>
                <Sparkles size={15} color="var(--gold-bright)" />
                <span>Executive Action Suite</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenQuickAction('project')}
                style={{ fontSize: 12, justifyContent: 'flex-start', padding: '7px 10px' }}
              >
                <FolderGit2 size={13} color="var(--gold-bright)" /> + Project
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenQuickAction('research')}
                style={{ fontSize: 12, justifyContent: 'flex-start', padding: '7px 10px' }}
              >
                <BookMarked size={13} color="var(--status-info)" /> + Paper
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenQuickAction('deadline')}
                style={{ fontSize: 12, justifyContent: 'flex-start', padding: '7px 10px' }}
              >
                <Calendar size={13} color="var(--status-danger)" /> + Deadline
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenQuickAction('achievement')}
                style={{ fontSize: 12, justifyContent: 'flex-start', padding: '7px 10px' }}
              >
                <Trophy size={13} color="var(--gold-bright)" /> + Award
              </button>
            </div>

            <button
              className="btn btn-gold btn-sm"
              onClick={onOpenPortfolio}
              style={{ width: '100%', marginTop: 12, justifyContent: 'center', gap: 6 }}
            >
              <Sparkles size={13} /> Export Executive Portfolio PDF
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
