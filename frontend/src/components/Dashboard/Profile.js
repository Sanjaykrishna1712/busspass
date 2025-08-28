import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, completeUserData, refreshUserProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({
    applicant_photo: false,
    study_certificate: false
  });

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        if (!completeUserData && user?.user_id) {
          const data = await refreshUserProfile();
          setProfileData(data);
        } else {
          setProfileData(completeUserData);
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [completeUserData, user, refreshUserProfile]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return dateString;
    }
  };

  const handleImageError = (imageType) => {
    setImageErrors(prev => ({
      ...prev,
      [imageType]: true
    }));
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container">
        <div className="profile-error">Failed to load profile data</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
      </div>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          
          <div className="profile-details">
            <h2>{profileData.name || 'User'}</h2>
            <p className="profile-email">{profileData.email || 'No email provided'}</p>
            
            {/* Personal Information */}
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">User ID:</span>
                  <span className="detail-value">{profileData._id || profileData.user_id || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gender:</span>
                  <span className="detail-value">{profileData.gender || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date of Birth:</span>
                  <span className="detail-value">{formatDate(profileData.dob)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Aadhar Number:</span>
                  <span className="detail-value">{profileData.aadhar_number || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mobile Number:</span>
                  <span className="detail-value">{profileData.mobile_no || 'Not provided'}</span>
                </div>
              </div>
            </div>
            
            {/* Address Information */}
            <div className="profile-section">
              <h3>Address Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">District:</span>
                  <span className="detail-value">{profileData.district || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mandal:</span>
                  <span className="detail-value">{profileData.mandal || 'Not specified'}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{profileData.address || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            {/* Education Information */}
            <div className="profile-section">
              <h3>Education Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Institution Name:</span>
                  <span className="detail-value">{profileData.institution_name || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Course Name:</span>
                  <span className="detail-value">{profileData.course_name || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Current Year:</span>
                  <span className="detail-value">{profileData.present_course_year || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Admission Number:</span>
                  <span className="detail-value">{profileData.admission_number || 'Not specified'}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Institution Address:</span>
                  <span className="detail-value">{profileData.inst_address || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            {/* Bus Pass Information */}
            <div className="profile-section">
              <h3>Bus Pass Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Pass Type:</span>
                  <span className="detail-value">{profileData.pass_type || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Service Type:</span>
                  <span className="detail-value">{profileData.service_type || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Renewal Frequency:</span>
                  <span className="detail-value">{profileData.renewal_frequency || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Account Created:</span>
                  <span className="detail-value">{formatDate(profileData.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Applicant Photo */}
            <div className="profile-section">
              <h3>Profile Photos</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Applicant Photo:</span>
                  {profileData.applicant_photo_url && !imageErrors.applicant_photo ? (
                    <img 
                      src={profileData.applicant_photo_url} 
                      alt="Applicant" 
                      className="profile-image"
                      onError={() => handleImageError('applicant_photo')}
                    />
                  ) : (
                    <span className="detail-value">Not uploaded or failed to load</span>
                  )}
                </div>
              </div>
            </div>

            {/* Study Certificate - UPDATED FOR SINGLE FILE */}
            <div className="profile-section">
              <h3>Study Certificate</h3>
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <span className="detail-label">Study Certificate:</span>
                  {profileData.study_certificate_url ? (
                    <a 
                      href={profileData.study_certificate_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="detail-value document-link"
                    >
                      <i className="fas fa-file-pdf"></i> View Certificate
                    </a>
                  ) : (
                    <span className="detail-value">No study certificate uploaded</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;