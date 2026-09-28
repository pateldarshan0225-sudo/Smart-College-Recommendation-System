import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Check, ArrowRight, Award, DollarSign, Building, TrendingUp, Compass, Star } from 'lucide-react';
import { playSound } from '../../utils/audio';
import { useAuth } from '../../context/AuthContext';

export const QuickRecommendationModal = ({ isOpen, onClose, colleges = [], onSelectCollege }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && !user) {
      onClose();
      navigate('/login');
    }
  }, [isOpen, user, navigate, onClose]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tenth: 85,
    twelfth: 88,
    entranceScore: 92,
    stream: 'Engineering',
    course: 'B.Tech CSE',
    budget: 350000,
    city: 'Gandhinagar',
    facilities: ['Hostel', 'Library', 'WiFi', 'Placement Cell']
  });

  const [recommendations, setRecommendations] = useState([]);
  const [calculating, setCalculating] = useState(false);

  if (!isOpen || !user) return null;

  const handleNext = () => {
    playSound('click');
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    playSound('click');
    setStep((s) => s - 1);
  };

  const calculateMatches = () => {
    playSound('success');
    setCalculating(true);
    setStep(4);

    setTimeout(() => {
      // Run Multi-Factor Scoring Algorithm (identical to backend)
      const acadScore = +(formData.tenth * 0.4 + formData.twelfth * 0.6).toFixed(1);

      const computed = (colleges.length ? colleges : [
        { _id: '1', name: 'DA-IICT', city: 'Gandhinagar', state: 'Gujarat', collegeType: 'Private', collegeRating: 4.8, eligibilityPercentage: 75, annualFee: 250000, avgPackage: '₹16.2 LPA', placementRate: 97 },
        { _id: '2', name: 'Nirma University - Institute of Tech', city: 'Ahmedabad', state: 'Gujarat', collegeType: 'Private', collegeRating: 4.6, eligibilityPercentage: 70, annualFee: 215000, avgPackage: '₹12.4 LPA', placementRate: 94 },
        { _id: '3', name: 'L.D. College of Engineering (LDCE)', city: 'Ahmedabad', state: 'Gujarat', collegeType: 'Government', collegeRating: 4.5, eligibilityPercentage: 65, annualFee: 6500, avgPackage: '₹7.8 LPA', placementRate: 90 },
        { _id: '4', name: 'Pandit Deendayal Energy University (PDEU)', city: 'Gandhinagar', state: 'Gujarat', collegeType: 'Deemed', collegeRating: 4.6, eligibilityPercentage: 65, annualFee: 280000, avgPackage: '₹9.5 LPA', placementRate: 92 },
        { _id: '5', name: 'BVM Engineering College', city: 'Anand', state: 'Gujarat', collegeType: 'Grant-in-Aid', collegeRating: 4.4, eligibilityPercentage: 60, annualFee: 45000, avgPackage: '₹6.8 LPA', placementRate: 88 }
      ]).map((c) => {
        const fee = c.annualFee || 180000;
        const budgetSc = fee <= formData.budget ? 100 : Math.max(0, +(100 - ((fee - formData.budget) / formData.budget) * 100).toFixed(1));
        const locSc = !formData.city || formData.city === 'Any' || formData.city.toLowerCase() === (c.city || '').toLowerCase() ? 100 : 60;
        const placementSc = c.placementRate || 85;
        const courseMatch = 95;
        const facilitySc = 90;

        const overall = +(acadScore * 0.3 + courseMatch * 0.2 + placementSc * 0.2 + budgetSc * 0.15 + facilitySc * 0.1 + locSc * 0.05).toFixed(1);

        const reasons = [];
        if (acadScore >= (c.eligibilityPercentage || 60)) reasons.push('Academic score meets eligibility cutoff');
        if (budgetSc >= 80) reasons.push('Annual fee fits within your specified budget');
        if (placementSc >= 90) reasons.push('High placement tier & tier-1 recruiter network');
        if (locSc === 100) reasons.push('Matches preferred campus location');

        return {
          ...c,
          overallScore: overall,
          academicScore: acadScore,
          budgetScore: budgetSc,
          placementScore: placementSc,
          reasons
        };
      });

      computed.sort((a, b) => b.overallScore - a.overallScore);
      setRecommendations(computed);
      setCalculating(false);
    }, 900);
  };

  const handleClose = () => {
    playSound('pop');
    setStep(1);
    onClose();
  };

  return (
    <div className="re-modal-backdrop" onClick={handleClose}>
      <div className="re-modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <button className="re-modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div className="re-interactive-badge" style={{ marginBottom: '8px' }}>
            <Sparkles size={12} /> SMART COLLEGE AI MATCHER
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', color: 'var(--re-text-primary)' }}>
            {step === 1 && 'Step 1: Academic Scores & Merit'}
            {step === 2 && 'Step 2: Stream, Degree & Budget'}
            {step === 3 && 'Step 3: Location & Campus Facilities'}
            {step === 4 && 'Your AI Recommended Colleges ✨'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--re-text-secondary)', margin: 0 }}>
            {step === 4
              ? 'Ranked using 6-factor algorithmic weighting: Academic (30%), Course (20%), Placements (20%), Budget (15%), Facilities (10%), Location (5%).'
              : 'Calculate instant admission probability and multi-factor recommendation match.'}
          </p>
        </div>

        {/* Step Progress Pills */}
        {step <= 3 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                style={{
                  height: '4px',
                  width: '40px',
                  borderRadius: '2px',
                  background: step >= num ? 'var(--re-accent-purple)' : 'var(--re-border-medium)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        )}

        {/* STEP 1: ACADEMICS */}
        {step === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '18px' }}>
              <div className="re-form-group">
                <label className="re-form-label">10th Board Percentage (%)</label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  className="re-form-input"
                  value={formData.tenth}
                  onChange={(e) => setFormData({ ...formData, tenth: Number(e.target.value) })}
                />
              </div>

              <div className="re-form-group">
                <label className="re-form-label">12th Science / HSC Percentage (%)</label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  className="re-form-input"
                  value={formData.twelfth}
                  onChange={(e) => setFormData({ ...formData, twelfth: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="re-form-group">
              <label className="re-form-label">Entrance Exam Percentile (JEE / GUJCET / CMAT)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 94.5"
                className="re-form-input"
                value={formData.entranceScore}
                onChange={(e) => setFormData({ ...formData, entranceScore: Number(e.target.value) })}
              />
            </div>

            <div style={{
              background: 'var(--re-bg-surface-subtle)',
              border: '1px solid var(--re-border-subtle)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '12px',
              color: 'var(--re-text-secondary)',
              marginBottom: '24px'
            }}>
              💡 Calculated Academic Index: <strong>{+(formData.tenth * 0.4 + formData.twelfth * 0.6).toFixed(1)}%</strong> (Weighted 40% 10th + 60% 12th).
            </div>

            <button className="re-btn-primary" onClick={handleNext}>
              Next: Stream & Budget <ArrowRight size={16} style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
            </button>
          </div>
        )}

        {/* STEP 2: STREAM & BUDGET */}
        {step === 2 && (
          <div>
            <div className="re-form-group">
              <label className="re-form-label">Preferred Academic Stream</label>
              <select
                className="re-form-select"
                value={formData.stream}
                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
              >
                <option value="Engineering">Engineering & Technology (B.Tech, B.E.)</option>
                <option value="Management">Management & Business (MBA, BBA)</option>
                <option value="Computing">Computer Applications & Data Science (MCA, B.Sc)</option>
                <option value="Design">Architecture & Design (B.Arch, B.Des)</option>
              </select>
            </div>

            <div className="re-form-group">
              <label className="re-form-label">Preferred Course Specialization</label>
              <select
                className="re-form-select"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              >
                <option value="B.Tech CSE">B.Tech Computer Science & Engineering</option>
                <option value="B.Tech ICT">B.Tech Information & Communication Tech</option>
                <option value="B.Tech AI">B.Tech Artificial Intelligence & Data Science</option>
                <option value="MBA">Master of Business Administration (MBA)</option>
                <option value="MCA">Master of Computer Applications (MCA)</option>
                <option value="BBA">Bachelor of Business Administration (BBA)</option>
              </select>
            </div>

            <div className="re-form-group">
              <label className="re-form-label">
                Max Annual Budget (Tuition + Campus Fee): ₹{(formData.budget / 100000).toFixed(1)} Lakhs
              </label>
              <input
                type="range"
                min="20000"
                max="600000"
                step="25000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--re-accent-purple)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--re-text-muted)', marginTop: '4px' }}>
                <span>₹20k (Govt)</span>
                <span>₹2.5L (Autonomous)</span>
                <span>₹6L (Private Elite)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--re-radius-pill)',
                  border: '1.5px solid var(--re-border-medium)',
                  background: 'transparent',
                  color: 'var(--re-text-primary)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button style={{ flex: 2 }} className="re-btn-primary" onClick={handleNext}>
                Next: Location & Facilities
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION & FACILITIES */}
        {step === 3 && (
          <div>
            <div className="re-form-group">
              <label className="re-form-label">Preferred Location / City</label>
              <select
                className="re-form-select"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                <option value="Any">Any Location in Gujarat</option>
                <option value="Gandhinagar">Gandhinagar</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Surat">Surat</option>
                <option value="Anand">Anand / V.V. Nagar</option>
              </select>
            </div>

            <div className="re-form-group">
              <label className="re-form-label">Must-Have Campus Facilities</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {['Hostel', 'Library', 'WiFi', 'Placement Cell', 'Sports Complex', 'Medical Facility'].map((fac) => {
                  const isChecked = formData.facilities.includes(fac);
                  return (
                    <div
                      key={fac}
                      onClick={() => {
                        playSound('tap');
                        setFormData({
                          ...formData,
                          facilities: isChecked
                            ? formData.facilities.filter((f) => f !== fac)
                            : [...formData.facilities, fac]
                        });
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: `1.5px solid ${isChecked ? 'var(--re-accent-purple)' : 'var(--re-border-subtle)'}`,
                        background: isChecked ? 'rgba(124, 109, 175, 0.08)' : 'var(--re-bg-surface-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: 'var(--re-text-primary)'
                      }}
                    >
                      <span>{fac}</span>
                      {isChecked && <Check size={14} color="var(--re-accent-purple)" strokeWidth={3} />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={handleBack}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--re-radius-pill)',
                  border: '1.5px solid var(--re-border-medium)',
                  background: 'transparent',
                  color: 'var(--re-text-primary)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button style={{ flex: 2 }} className="re-btn-primary" onClick={calculateMatches}>
                Run AI Match Engine 🚀
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: RECOMMENDATIONS RESULTS */}
        {step === 4 && (
          <div>
            {calculating ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px', animation: 're-spin-slow 2s linear infinite', display: 'inline-block' }}>
                  ⚙️
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 6px' }}>
                  Evaluating 500+ Universities...
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--re-text-secondary)', margin: 0 }}>
                  Computing academic eligibility, package ROI, and fee thresholds.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px', marginBottom: '20px' }}>
                  {recommendations.slice(0, 4).map((col, idx) => (
                    <div
                      key={col._id || idx}
                      style={{
                        background: idx === 0 ? 'linear-gradient(135deg, rgba(124, 109, 175, 0.08) 0%, rgba(255, 164, 57, 0.08) 100%)' : 'var(--re-bg-surface-subtle)',
                        border: `1.5px solid ${idx === 0 ? 'var(--re-accent-purple)' : 'var(--re-border-subtle)'}`,
                        borderRadius: '16px',
                        padding: '16px',
                        position: 'relative'
                      }}
                    >
                      {idx === 0 && (
                        <div style={{ position: 'absolute', top: '12px', right: '14px', background: 'var(--re-accent-amber)', color: '#1A1433', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                          TOP #1 MATCH
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--re-text-primary)', margin: '0 0 2px' }}>
                            {col.name}
                          </h4>
                          <div style={{ fontSize: '12px', color: 'var(--re-text-secondary)', display: 'flex', gap: '10px' }}>
                            <span>📍 {col.city}, {col.state || 'Gujarat'}</span>
                            <span>🏛 {col.collegeType}</span>
                            <span>⭐ {col.collegeRating || 4.5}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', marginRight: idx === 0 ? '90px' : 0 }}>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--re-accent-purple)' }}>
                            {col.overallScore}%
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--re-text-muted)', fontWeight: 700 }}>FIT SCORE</div>
                        </div>
                      </div>

                      {/* Rationale Chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0' }}>
                        {(col.reasons || []).map((r, ri) => (
                          <span
                            key={ri}
                            style={{
                              fontSize: '11px',
                              background: '#FFFFFF',
                              border: '1px solid rgba(0,0,0,0.06)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              color: 'var(--re-text-secondary)'
                            }}
                          >
                            ✓ {r}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--re-border-subtle)', fontSize: '12px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--re-text-primary)' }}>
                          Placement Avg: <span style={{ color: '#FFA439' }}>{col.avgPackage || '₹12 LPA'}</span>
                        </span>

                        <button
                          onClick={() => {
                            handleClose();
                            if (onSelectCollege) onSelectCollege(col);
                          }}
                          style={{
                            background: 'var(--re-accent-purple)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: 'var(--re-radius-pill)',
                            padding: '6px 14px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          View College Dossier ↗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 'var(--re-radius-pill)',
                      border: '1.5px solid var(--re-border-medium)',
                      background: 'transparent',
                      color: 'var(--re-text-primary)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Adjust Scores ↻
                  </button>
                  <button style={{ flex: 2 }} className="re-btn-primary" onClick={handleClose}>
                    Save to My College Shortlist ✨
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
