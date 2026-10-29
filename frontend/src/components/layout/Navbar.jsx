import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  X,
  User,
  BookOpen,
  FolderGit2,
  BookMarked,
  Trophy,
  Calendar,
  LogOut,
  Plus,
  Sparkles,
  ChevronDown,
  Layers,
  Activity,
  Award,
  Crown,
  Gem
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  onOpenQuickAction,
  onOpenPortfolio,
  onOpenProfile,
  onToggleMobileSidebar,
  recentActivities = [],
  currentTab = 'dashboard',
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const quickMenuRef = useRef(null);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (quickMenuRef.current && !quickMenuRef.current.contains(e.target)) setShowQuickMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickActions = [
    { key: 'project', label: 'New Project', icon: FolderGit2, color: 'var(--gold-bright)' },
    { key: 'research', label: 'New Research Paper', icon: BookMarked, color: 'var(--status-info)' },
    { key: 'achievement', label: 'New Achievement', icon: Trophy, color: 'var(--status-warning)' },
    { key: 'subject', label: 'New Course', icon: BookOpen, color: 'var(--status-purple)' },
    { key: 'deadline', label: 'New Deadline', icon: Calendar, color: 'var(--status-danger)' },
  ];

  const getBreadcrumbLabel = () => {
    switch (currentTab) {
      case 'subjects': return 'Courses & Academics';
      case 'projects': return 'Project Repositories';
      case 'research': return 'Research & Publications';
      case 'achievements': return 'Honors & Distinctions';
      case 'deadlines': return 'Deadlines & Schedule';
      case 'timeline': return 'Audit & Activity Log';
      default: return 'Executive Workspace';
    }
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '115%',
    right: 0,
    background: 'var(--bg-glass-strong)',
    borderRadius: 'var(--radius-md)',
    padding: '8px',
    zIndex: 60,
    boxShadow: 'var(--shadow-modal)',
    border: '1px solid rgba(212, 175, 55, 0.4)',
  };

  return (
    <header className="top-navbar">
      {/* Left: Brand + Breadcrumbs */}
      <div className="navbar-left">
        <div className="brand-badge">
          <div className="brand-logo-icon">VP</div>
          <div className="brand-name">
            <span className="gold-gradient-text">VIERP</span>
            <span className="brand-pill">Premium</span>
          </div>
        </div>

        <span className="navbar-breadcrumb-divider">/</span>
        <span className="navbar-breadcrumb-text">{getBreadcrumbLabel()}</span>

        {/* Global Fast Search */}
        <div className="search-container" style={{ maxWidth: 260 }}>
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search workspace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick Action, Notifications, Theme, User Chip */}
      <div className="navbar-right">
        {/* Quick Add Dropdown */}
        <div style={{ position: 'relative' }} ref={quickMenuRef}>
          <button
            className="btn btn-gold btn-sm"
            onClick={() => setShowQuickMenu((prev) => !prev)}
            style={{ gap: 5 }}
          >
            <Plus size={14} />
            <span>New Entry</span>
            <ChevronDown size={12} style={{ opacity: 0.8 }} />
          </button>

          {showQuickMenu && (
            <div className="animate-fade-in" style={{ ...dropdownStyle, width: 210 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--gold-bright)', textTransform: 'uppercase', padding: '4px 8px 6px', letterSpacing: '0.06em' }}>
                Add to Workspace
              </div>
              {quickActions.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '7px 8px', fontSize: 13, gap: 8, boxShadow: 'none' }}
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenQuickAction(key);
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Icon size={14} color={color} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Activity Feed */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="btn-icon btn-secondary"
            onClick={() => setShowNotifications((prev) => !prev)}
            title="Activity Notifications"
            style={{ position: 'relative', width: 34, height: 34 }}
          >
            <Bell size={15} />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--gold-bright)',
                boxShadow: '0 0 8px var(--gold-bright)',
              }}
            />
          </button>

          {showNotifications && (
            <div className="animate-fade-in" style={{ ...dropdownStyle, width: 320, padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Gem size={14} color="var(--gold-bright)" />
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>Recent Updates</span>
                </div>
                <span className="badge badge-gold" style={{ fontSize: 10.5 }}>{recentActivities.length} new</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 260, overflowY: 'auto' }}>
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 5).map((act, i) => (
                    <div
                      key={act._id || i}
                      style={{
                        padding: '8px 10px',
                        background: 'rgba(212, 175, 55, 0.06)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(212, 175, 55, 0.18)',
                      }}
                    >
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#ffffff' }}>{act.title}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 1 }}>{act.description}</div>
                      <div style={{ fontSize: 10, color: 'var(--gold-bright)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
                        {new Date(act.timestamp || act.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '14px 0' }}>
                    No recent updates
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          className="btn-icon btn-secondary"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{ width: 34, height: 34 }}
        >
          {theme === 'dark' ? <Sun size={15} color="var(--gold-bright)" /> : <Moon size={15} />}
        </button>

        {/* User Profile Chip */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '3px 8px 3px 3px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0.04) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.38)',
            }}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.name}
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--gold-primary)' }}
            />
            <div style={{ textAlign: 'left', paddingRight: 2 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>
                {user?.name?.split(' ')[0] || 'Aryan'}
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--gold-bright)', fontWeight: 800, letterSpacing: '0.04em' }}>
                PREMIUM
              </div>
            </div>
            <ChevronDown size={12} color="var(--text-muted)" />
          </button>

          {showUserMenu && (
            <div className="animate-fade-in" style={{ ...dropdownStyle, width: 210, padding: '8px' }}>
              <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--gold-bright)', fontFamily: 'var(--font-mono)' }}>{user?.rollNumber}</div>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '6px 8px', fontSize: 12.5, gap: 8, boxShadow: 'none' }}
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenProfile();
                }}
              >
                <User size={14} />
                <span>Account Profile</span>
              </button>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '6px 8px', fontSize: 12.5, gap: 8, boxShadow: 'none' }}
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenPortfolio();
                }}
              >
                <Sparkles size={14} color="var(--gold-bright)" />
                <span>Export Portfolio</span>
              </button>

              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '6px 8px', fontSize: 12.5, gap: 8, color: 'var(--status-danger)', boxShadow: 'none' }}
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
