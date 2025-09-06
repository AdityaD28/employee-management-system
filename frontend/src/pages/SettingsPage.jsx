import React, { useState, useEffect } from 'react';

function SettingsPage({ showNotification }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: ''
  });
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      reports: false
    },
    language: 'en',
    timezone: 'UTC'
  });
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false
  });
  const [companySettings, setCompanySettings] = useState({
    companyName: 'TechCorp Inc.',
    address: '123 Business Ave, Tech City, TC 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@techcorp.com',
    fiscalYearStart: 'January',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: { start: '09:00', end: '17:00' }
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    // Load user profile from localStorage or API
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  };

  const handleProfileUpdate = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    showNotification('Profile updated successfully', 'success');
  };

  const handlePasswordChange = () => {
    if (security.newPassword !== security.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    if (security.newPassword.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactor: security.twoFactor });
    showNotification('Password updated successfully', 'success');
  };

  const handlePreferencesUpdate = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    showNotification('Preferences updated successfully', 'success');
  };

  const handleCompanySettingsUpdate = () => {
    localStorage.setItem('companySettings', JSON.stringify(companySettings));
    showNotification('Company settings updated successfully', 'success');
  };

  const exportData = () => {
    showNotification('Data export initiated. Download will start shortly.', 'success');
  };

  const renderProfileTab = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ margin: '0 0 2rem 0', color: '#1e293b', fontSize: '1.5rem' }}>Profile Information</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
            Phone
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
            Position
          </label>
          <input
            type="text"
            value={profile.position}
            onChange={(e) => setProfile(prev => ({ ...prev, position: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
            Department
          </label>
          <select
            value={profile.department}
            onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleProfileUpdate}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '1rem'
        }}
      >
        Update Profile
      </button>
    </div>
  );

  const renderSecurityTab = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ margin: '0 0 2rem 0', color: '#1e293b', fontSize: '1.5rem' }}>Security Settings</h3>
      
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Change Password</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              Current Password
            </label>
            <input
              type="password"
              value={security.currentPassword}
              onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              New Password
            </label>
            <input
              type="password"
              value={security.newPassword}
              onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={security.confirmPassword}
              onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>
        <button
          onClick={handlePasswordChange}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 2rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Change Password
        </button>
      </div>

      <div style={{ paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Two-Factor Authentication</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={security.twoFactor}
              onChange={(e) => setSecurity(prev => ({ ...prev, twoFactor: e.target.checked }))}
              style={{ marginRight: '0.5rem' }}
            />
            Enable Two-Factor Authentication
          </label>
        </div>
        <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>
          Add an extra layer of security to your account
        </p>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ margin: '0 0 2rem 0', color: '#1e293b', fontSize: '1.5rem' }}>User Preferences</h3>
      
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div>
          <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Appearance</h4>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              Theme
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
              style={{
                width: '200px',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Notifications</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: e.target.checked }
                }))}
                style={{ marginRight: '0.5rem' }}
              />
              Email Notifications
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.notifications.push}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, push: e.target.checked }
                }))}
                style={{ marginRight: '0.5rem' }}
              />
              Push Notifications
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.notifications.reports}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, reports: e.target.checked }
                }))}
                style={{ marginRight: '0.5rem' }}
              />
              Weekly Reports
            </label>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              Language
            </label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              Timezone
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="CST">Central Time</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handlePreferencesUpdate}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Save Preferences
      </button>
    </div>
  );

  const renderCompanyTab = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ margin: '0 0 2rem 0', color: '#1e293b', fontSize: '1.5rem' }}>Company Settings</h3>
      
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              Company Name
            </label>
            <input
              type="text"
              value={companySettings.companyName}
              onChange={(e) => setCompanySettings(prev => ({ ...prev, companyName: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              Email
            </label>
            <input
              type="email"
              value={companySettings.email}
              onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              Address
            </label>
            <textarea
              value={companySettings.address}
              onChange={(e) => setCompanySettings(prev => ({ ...prev, address: e.target.value }))}
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Working Hours</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Start Time
              </label>
              <input
                type="time"
                value={companySettings.workingHours.start}
                onChange={(e) => setCompanySettings(prev => ({
                  ...prev,
                  workingHours: { ...prev.workingHours, start: e.target.value }
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                End Time
              </label>
              <input
                type="time"
                value={companySettings.workingHours.end}
                onChange={(e) => setCompanySettings(prev => ({
                  ...prev,
                  workingHours: { ...prev.workingHours, end: e.target.value }
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Data Management</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={exportData}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Export All Data
            </button>
            <button
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Backup Database
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleCompanySettingsUpdate}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Save Company Settings
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
          ⚙️ Settings
        </h1>
        <p style={{ margin: 0, color: '#64748b' }}>Manage your account and application preferences</p>
      </div>

      {/* Settings Navigation */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'profile', label: 'Profile', icon: '👤' },
          { id: 'security', label: 'Security', icon: '🔒' },
          { id: 'preferences', label: 'Preferences', icon: '🎨' },
          { id: 'company', label: 'Company', icon: '🏢' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: activeTab === tab.id ? 'none' : '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'security' && renderSecurityTab()}
      {activeTab === 'preferences' && renderPreferencesTab()}
      {activeTab === 'company' && renderCompanyTab()}
    </div>
  );
}

export default SettingsPage;
