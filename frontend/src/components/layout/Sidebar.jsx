import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  FolderGit2,
  BookMarked,
  Trophy,
  Calendar,
  Activity,
  Sparkles,
  ExternalLink,
  Gem
} from 'lucide-react';

export const Sidebar = ({
  currentTab,
  setCurrentTab,
  counts = {},
  isMobileOpen,
  setIsMobileOpen,
  onOpenPortfolio,
  onOpenProfile,
}) => {
  const navItems = [
    { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { id: 'subjects',     label: 'Courses',      icon: BookOpen,    badge: counts.subjects !== undefined ? counts.subjects : 6 },
    { id: 'projects',     label: 'Projects',     icon: FolderGit2,  badge: counts.projects !== undefined ? counts.projects : 5 },
    { id: 'research',     label: 'Research',     icon: BookMarked,  badge: counts.papers !== undefined ? counts.papers : 4 },
    { id: 'achievements', label: 'Achievements', icon: Trophy,      badge: counts.achievements !== undefined ? counts.achievements : 6 },
    { id: 'deadlines',    label: 'Deadlines',    icon: Calendar,    badge: counts.deadlines !== undefined ? counts.deadlines : 5 },
    { id: 'timeline',     label: 'Timeline',     icon: Activity },
  ];

  return (
    <nav className="workspace-tabs-bar" aria-label="Workspace Navigation">
      <div className="workspace-nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`workspace-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="workspace-tab-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12 }}>
        <button
          className="btn btn-gold btn-sm"
          onClick={onOpenPortfolio}
          style={{ gap: 6, fontSize: 12, padding: '5px 12px' }}
        >
          <Sparkles size={13} />
          <span>Export Portfolio</span>
        </button>
      </div>
    </nav>
  );
};
