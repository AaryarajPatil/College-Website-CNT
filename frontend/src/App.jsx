import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { AuthView } from './components/auth/AuthView';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Loader } from './components/common/CommonModals';

// Page Views
import { DashboardView } from './components/dashboard/DashboardView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { ResearchView } from './components/research/ResearchView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { DeadlinesView } from './components/deadlines/DeadlinesView';
import { TimelineView } from './components/timeline/TimelineView';

// Modals
import { QuickCreateModal } from './components/common/QuickCreateModal';
import { PortfolioModal } from './components/portfolio/PortfolioModal';
import { ProfileModal } from './components/profile/ProfileModal';

// API Services
import {
  analyticsAPI,
  subjectAPI,
  projectAPI,
  researchAPI,
  achievementAPI,
  deadlineAPI,
  activityAPI,
} from './services/api';

import './styles/dashboard.css';

export const App = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // App Data States
  const [dataLoading, setDataLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [researchData, setResearchData] = useState({ papers: [], statusCounts: {} });
  const [achievementsData, setAchievementsData] = useState({ achievements: [], categoryStats: {} });
  const [deadlines, setDeadlines] = useState([]);
  const [activities, setActivities] = useState([]);

  // Modal Control States
  const [quickCreateType, setQuickCreateType] = useState(null); // 'project' | 'research' | 'achievement' | 'subject' | 'deadline'
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch all core datasets
  const fetchAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    setDataLoading(true);

    try {
      const [dashRes, subRes, projRes, resRes, achRes, deadRes, actRes] = await Promise.all([
        analyticsAPI.getDashboardStats().catch((e) => ({ data: { data: null } })),
        subjectAPI.getAll().catch((e) => ({ data: { data: [] } })),
        projectAPI.getAll().catch((e) => ({ data: { data: [] } })),
        researchAPI.getAll().catch((e) => ({ data: { data: [], statusCounts: {} } })),
        achievementAPI.getAll().catch((e) => ({ data: { data: [], categoryStats: {} } })),
        deadlineAPI.getAll().catch((e) => ({ data: { data: [] } })),
        activityAPI.getAll({ limit: 40 }).catch((e) => ({ data: { data: [] } })),
      ]);

      if (dashRes.data?.data) setDashboardData(dashRes.data.data);
      if (subRes.data?.data) setSubjects(subRes.data.data);
      if (projRes.data?.data) setProjects(projRes.data.data);
      if (resRes.data) {
        setResearchData({
          papers: resRes.data.data || [],
          statusCounts: resRes.data.statusCounts || {},
        });
      }
      if (achRes.data) {
        setAchievementsData({
          achievements: achRes.data.data || [],
          categoryStats: achRes.data.categoryStats || {},
        });
      }
      if (deadRes.data?.data) setDeadlines(deadRes.data.data);
      if (actRes.data?.data) setActivities(actRes.data.data);
    } catch (err) {
      console.error('Failed to sync dashboard data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  // Toggle deadline completion
  const handleToggleDeadline = async (id) => {
    try {
      const res = await deadlineAPI.toggle(id);
      toast.success(res.data.message || 'Deadline status updated!');
      fetchAllData();
    } catch (err) {
      toast.error('Failed to toggle deadline status.');
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <Loader size={36} text="Loading VIERP Premium Workspace..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthView />;
  }

  // Counts for tabs
  const tabCounts = {
    subjects: subjects.length,
    projects: projects.length,
    papers: researchData.papers.length,
    achievements: achievementsData.achievements.length,
    deadlines: deadlines.filter((d) => d.status === 'Pending').length,
  };

  return (
    <div className="app-layout">
      {/* Top Navbar Header */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenQuickAction={(type) => setQuickCreateType(type)}
        onOpenPortfolio={() => setIsPortfolioOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        recentActivities={activities}
        currentTab={currentTab}
      />

      {/* Horizontal Workspace Navigation Bar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        counts={tabCounts}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onOpenPortfolio={() => setIsPortfolioOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Workspace Viewport */}
      <div className="main-viewport">
        <main className="page-container">
          {dataLoading && !dashboardData ? (
            <Loader size={32} text="Syncing academic records..." />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  dashboardData={dashboardData}
                  projects={projects}
                  subjects={subjects}
                  researchData={researchData}
                  achievementsData={achievementsData}
                  deadlines={deadlines}
                  activities={activities}
                  onNavigate={(tab) => setCurrentTab(tab)}
                  onOpenQuickAction={(type) => setQuickCreateType(type)}
                  onToggleDeadline={handleToggleDeadline}
                  onOpenPortfolio={() => setIsPortfolioOpen(true)}
                  onOpenProfile={() => setIsProfileOpen(true)}
                />
              )}

              {currentTab === 'subjects' && (
                <SubjectsView
                  subjects={subjects}
                  onRefresh={fetchAllData}
                  onOpenAddModal={() => setQuickCreateType('subject')}
                />
              )}

              {currentTab === 'projects' && (
                <ProjectsView
                  projects={projects}
                  subjects={subjects}
                  onRefresh={fetchAllData}
                  onOpenAddModal={() => setQuickCreateType('project')}
                />
              )}

              {currentTab === 'research' && (
                <ResearchView
                  papers={researchData.papers}
                  statusCounts={researchData.statusCounts}
                  onRefresh={fetchAllData}
                  onOpenAddModal={() => setQuickCreateType('research')}
                />
              )}

              {currentTab === 'achievements' && (
                <AchievementsView
                  achievements={achievementsData.achievements}
                  categoryStats={achievementsData.categoryStats}
                  onRefresh={fetchAllData}
                  onOpenAddModal={() => setQuickCreateType('achievement')}
                />
              )}

              {currentTab === 'deadlines' && (
                <DeadlinesView
                  deadlines={deadlines}
                  subjects={subjects}
                  onRefresh={fetchAllData}
                  onOpenAddModal={() => setQuickCreateType('deadline')}
                  onToggleDeadline={handleToggleDeadline}
                />
              )}

              {currentTab === 'timeline' && (
                <TimelineView activities={activities} />
              )}
            </>
          )}
        </main>
      </div>

      {/* QUICK CREATE MODAL */}
      <QuickCreateModal
        type={quickCreateType}
        isOpen={!!quickCreateType}
        onClose={() => setQuickCreateType(null)}
        subjects={subjects}
        onSuccess={fetchAllData}
      />

      {/* PORTFOLIO / RESUME SHOWCASE MODAL */}
      <PortfolioModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        subjects={subjects}
        projects={projects}
        papers={researchData.papers}
        achievements={achievementsData.achievements}
      />

      {/* PROFILE SETTINGS MODAL */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          fetchAllData();
        }}
      />
    </div>
  );
};
