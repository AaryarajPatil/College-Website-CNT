import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Zap,
  GraduationCap,
  Gem,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthView = () => {
  const { login, register, forgotPassword, resetPassword, verifyEmailOtp } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot' | 'reset' | 'otp'
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    branch: 'Computer Science & Engineering',
    year: 4,
    semester: 7,
    specialization: 'Artificial Intelligence & Machine Learning',
  });

  const [forgotEmail, setForgotEmail] = useState('');
  const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '' });
  const [otpVerifyData, setOtpVerifyData] = useState({ email: '', otp: '' });

  // Quick fill for demo account
  const fillDemoAccount = () => {
    setLoginForm({
      email: 'aryan.sharma@vierp.edu',
      password: 'password123',
    });
    toast.info('Loaded demo credentials for Aryan Sharma');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.warning('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success('Welcome back to VIERP Premium.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.rollNumber) {
      toast.warning('Please fill in all mandatory fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await register(signupForm);
      toast.success(res?.message || 'Account created successfully! Welcome to VIERP.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.warning('Please provide your registered academic email.');
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(forgotEmail);
      toast.success(res?.message || 'Verification code dispatched.');
      setResetData({ email: forgotEmail, otp: res?.otpPreview || '', newPassword: '' });
      setMode('reset');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetData.email || !resetData.otp || !resetData.newPassword) {
      toast.warning('Please fill in email, OTP, and new password.');
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(resetData.email, resetData.otp, resetData.newPassword);
      toast.success(res.message || 'Password updated! Please log in.');
      setMode('login');
      setLoginForm({ email: resetData.email, password: resetData.newPassword });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerifySubmit = async (e) => {
    e.preventDefault();
    if (!otpVerifyData.email || !otpVerifyData.otp) {
      toast.warning('Please enter the OTP sent to your email.');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyEmailOtp(otpVerifyData.email, otpVerifyData.otp);
      toast.success(res.message || 'Email verified successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient gold glow */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: 450,
          height: 450,
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '20%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(245, 212, 120, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Auth Card */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 470,
          padding: '38px 40px',
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 'var(--radius-md)',
              background: 'var(--gold-gradient-metallic)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#080705',
              boxShadow: '0 0 24px rgba(212, 175, 55, 0.55)',
              marginBottom: 14,
              fontSize: 20,
              fontWeight: 900,
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            VP
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            <span className="gold-gradient-text">VIERP</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}> Premium</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}>
            <span className="badge badge-gold" style={{ fontSize: 11, fontWeight: 800 }}>
              <Gem size={10} /> EXECUTIVE ACADEMIC SUITE
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 8 }}>
            Academic Portfolio, Research & Analytics Management
          </p>
        </div>

        {/* Demo Account Fast-Fill Banner */}
        {mode === 'login' && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0.04) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--gold-bright)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Zap size={13} /> Demo Account Available
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>
                Aryan Sharma • 21BCE10482
              </div>
            </div>
            <button
              type="button"
              className="btn btn-gold btn-sm"
              onClick={fillDemoAccount}
              style={{ padding: '4px 12px', fontSize: 11.5 }}
            >
              Fill Demo
            </button>
          </div>
        )}

        {/* Auth Mode Tabs */}
        {(mode === 'login' || mode === 'signup') && (
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: 22,
            }}
          >
            <button
              type="button"
              style={{
                flex: 1,
                padding: '8px',
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                background: mode === 'login' ? 'var(--gold-gradient)' : 'transparent',
                color: mode === 'login' ? '#080705' : 'var(--text-secondary)',
                boxShadow: mode === 'login' ? '0 2px 8px rgba(212, 175, 55, 0.4)' : 'none',
                transition: 'all 0.15s ease',
              }}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '8px',
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                background: mode === 'signup' ? 'var(--gold-gradient)' : 'transparent',
                color: mode === 'signup' ? '#080705' : 'var(--text-secondary)',
                boxShadow: mode === 'signup' ? '0 2px 8px rgba(212, 175, 55, 0.4)' : 'none',
                transition: 'all 0.15s ease',
              }}
              onClick={() => setMode('signup')}
            >
              Register
            </button>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="animate-fade-in">
            <div className="form-group">
              <label className="form-label">Academic Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="student@vierp.edu"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  style={{ fontSize: 12, color: 'var(--gold-bright)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="••••••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-gold btn-lg"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Sparkles size={16} /> Authenticating...
                </>
              ) : (
                <>
                  Enter Workspace
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="e.g. Aryan Sharma"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-cols-2" style={{ gap: 8 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Roll Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="21BCE10482"
                  value={signupForm.rollNumber}
                  onChange={(e) => setSignupForm({ ...signupForm, rollNumber: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Semester</label>
                <select
                  className="form-select"
                  value={signupForm.semester}
                  onChange={(e) => setSignupForm({ ...signupForm, semester: Number(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Branch</label>
              <input
                type="text"
                className="form-input"
                placeholder="Computer Science & Engineering"
                value={signupForm.branch}
                onChange={(e) => setSignupForm({ ...signupForm, branch: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Academic Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="student@vierp.edu"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="At least 6 characters"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-gold btn-lg"
              style={{ width: '100%', marginTop: 6 }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <KeyRound size={28} color="var(--gold-bright)" style={{ margin: '0 auto 8px' }} />
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Reset Password</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Enter your academic email to receive a verification OTP.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="student@vierp.edu"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-gold btn-lg"
              style={{ width: '100%', marginTop: 4 }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Verification OTP'}
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setMode('login')}
              style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* RESET PASSWORD */}
        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <ShieldCheck size={28} color="var(--gold-bright)" style={{ margin: '0 auto 8px' }} />
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Set New Password</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Enter the 6-digit OTP code sent to your email.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">OTP Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="123456"
                value={resetData.otp}
                onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
                required
                maxLength={6}
                style={{ textAlign: 'center', letterSpacing: '0.25em', fontSize: 18, fontWeight: 700 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={resetData.newPassword}
                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-gold btn-lg"
              style={{ width: '100%', marginTop: 4 }}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save & Sign In'}
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setMode('login')}
              style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
            >
              Cancel
            </button>
          </form>
        )}

        {/* OTP EMAIL VERIFICATION */}
        {mode === 'otp' && (
          <form onSubmit={handleOtpVerifySubmit} className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <CheckCircle2 size={28} color="var(--gold-bright)" style={{ margin: '0 auto 8px' }} />
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Verify Academic Email</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Enter the OTP dispatched to <strong>{otpVerifyData.email}</strong>.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">6-Digit OTP</label>
              <input
                type="text"
                className="form-input"
                placeholder="123456"
                value={otpVerifyData.otp}
                onChange={(e) => setOtpVerifyData({ ...otpVerifyData, otp: e.target.value })}
                required
                maxLength={6}
                style={{ textAlign: 'center', letterSpacing: '0.25em', fontSize: 18, fontWeight: 700 }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-gold btn-lg"
              style={{ width: '100%', marginTop: 4 }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email & Continue'}
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setMode('login')}
              style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
