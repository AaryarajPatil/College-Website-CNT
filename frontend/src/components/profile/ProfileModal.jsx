import React, { useState } from 'react';
import { User, Sparkles, Image, Link as LinkIcon } from 'lucide-react';
import { Modal } from '../common/CommonModals';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    rollNumber: user?.rollNumber || '',
    branch: user?.branch || 'Computer Science & Engineering',
    specialization: user?.specialization || 'Artificial Intelligence & Machine Learning',
    year: user?.year || 'Final Year (4th Year)',
    semester: user?.semester || 7,
    cgpa: user?.cgpa || 9.34,
    avatar: user?.avatar || '',
    bio: user?.bio || '',
    socialLinks: {
      github: user?.socialLinks?.github || '',
      linkedin: user?.socialLinks?.linkedin || '',
      scholar: user?.socialLinks?.scholar || '',
      portfolio: user?.socialLinks?.portfolio || '',
    },
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Academic profile updated successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Academic Profile Settings" maxWidth="680px">
      <form onSubmit={handleSave}>
        {/* Avatar preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <img
            src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160'}
            alt="Avatar"
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-bright)' }}
          />
          <div style={{ flex: 1 }}>
            <label className="form-label">Profile Avatar Image URL</label>
            <input
              type="url"
              className="form-input"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Student Full Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">University Roll Number *</label>
            <input
              type="text"
              className="form-input"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Branch & Degree</label>
            <input
              type="text"
              className="form-input"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input
              type="text"
              className="form-input"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Year of Study</label>
            <input
              type="text"
              className="form-input"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Semester</label>
            <input
              type="number"
              min="1"
              max="8"
              className="form-input"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Cumulative CGPA</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              className="form-input"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Student Bio / Executive Summary</label>
          <textarea
            className="form-textarea"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        {/* Social / Portfolio Links */}
        <h4 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--gold-bright)', margin: '14px 0 10px 0' }}>
          Portfolio & Research Citations Links
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input
              type="url"
              className="form-input"
              value={formData.socialLinks.github}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, github: e.target.value },
                })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">LinkedIn Profile</label>
            <input
              type="url"
              className="form-input"
              value={formData.socialLinks.linkedin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Google Scholar Citations</label>
            <input
              type="url"
              className="form-input"
              value={formData.socialLinks.scholar}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, scholar: e.target.value },
                })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Personal Portfolio URL</label>
            <input
              type="url"
              className="form-input"
              value={formData.socialLinks.portfolio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, portfolio: e.target.value },
                })
              }
            />
          </div>
        </div>

        <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-gold btn-sm" disabled={loading}>
            {loading ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
