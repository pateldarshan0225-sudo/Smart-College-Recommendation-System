import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { GraduationCap, Calculator, Save, CheckCircle2, Award, Zap } from 'lucide-react';
import { playSound } from '../../utils/audio';

export default function Academic() {
  const { isDark } = useTheme();

  const [form, setForm] = useState({
    tenthPercentage: 85.5,
    twelfthPercentage: 88.0,
    ugPercentage: '',
    entranceExam: 'GUJCET',
    entranceScore: 95.0,
    passingYear: 2024
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Academic Records & Scores - Student Portal';
    api.get('/academic').then((r) => {
      if (r.data?.data) {
        setForm({
          ...r.data.data,
          entranceExam: r.data.data.entranceExam || 'GUJCET'
        });
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      playSound('tap');
      const r = await api.put('/academic', form);
      if (r.data?.data) {
        setForm(r.data.data);
      }
      playSound('pop');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving academic records');
    } finally {
      setSaving(false);
    }
  };

  // Estimated ACPC Merit Score: 50% 12th Board + 50% Entrance Score
  const estimatedMerit = (
    ((form.twelfthPercentage || 0) * 0.5) +
    ((form.entranceScore || 0) * 0.5)
  ).toFixed(2);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* LEFT: Academic Record Form */}
      <div
        style={{
          background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 30px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2',
          boxShadow: '0 8px 30px rgba(78, 63, 166, 0.05)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', paddingBottom: '16px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F0F2F8' }}>
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: '0 0 4px 0' }}>
              Academic Scorecard
            </h2>
            <div style={{ fontSize: '12px', color: isDark ? '#9DA3BC' : '#7E84A3' }}>
              Your verified 10th, 12th & entrance percentiles
            </div>
          </div>

          {savedSuccess && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', padding: '4px 12px', borderRadius: '999px', fontSize: '11.5px', fontWeight: '800' }}>
              <CheckCircle2 size={13} />
              <span>Scores Saved</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '6px' }}>
                10th (SSC) %:
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={form.tenthPercentage ?? ''}
                onChange={(e) => setForm({ ...form, tenthPercentage: e.target.value === '' ? '' : Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '700' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '6px' }}>
                12th (HSC) Science %:
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={form.twelfthPercentage ?? ''}
                onChange={(e) => setForm({ ...form, twelfthPercentage: e.target.value === '' ? '' : Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '700' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '6px' }}>
                Entrance Exam:
              </label>
              <select
                value={form.entranceExam || 'GUJCET'}
                onChange={(e) => setForm({ ...form, entranceExam: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '700' }}
              >
                <option value="GUJCET">GUJCET (Gujarat CET)</option>
                <option value="JEE Main">JEE Main</option>
                <option value="NEET">NEET</option>
                <option value="CMAT">CMAT (MBA / MCA)</option>
                <option value="CAT">CAT (Management)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '6px' }}>
                Entrance Percentile / Score:
              </label>
              <input
                type="number"
                step="0.01"
                value={form.entranceScore ?? ''}
                onChange={(e) => setForm({ ...form, entranceScore: e.target.value === '' ? '' : Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '700' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '6px' }}>
                Passing Year:
              </label>
              <input
                type="number"
                value={form.passingYear ?? 2024}
                onChange={(e) => setForm({ ...form, passingYear: e.target.value === '' ? '' : Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '700' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '6px' }}>
                Undergraduate (UG) % (if PG):
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Optional for B.Tech"
                value={form.ugPercentage ?? ''}
                onChange={(e) => setForm({ ...form, ugPercentage: e.target.value === '' ? '' : Number(e.target.value) })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E9F2', background: isDark ? '#1F183C' : '#FFFFFF', color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: '13.5px', fontWeight: '700' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: '10px',
              padding: '12px 20px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #6857E9 0%, #4633B5 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(104, 87, 233, 0.35)'
            }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Academic Record'}</span>
          </button>
        </form>
      </div>

      {/* RIGHT: ACPC Merit Preview & Analysis Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #1C1542 0%, #29184D 100%)'
              : 'linear-gradient(135deg, #F0EDFE 0%, #FFEAF0 100%)',
            borderRadius: '24px',
            padding: '26px',
            border: isDark ? '1px solid rgba(104, 87, 233, 0.3)' : '1px solid #E4DCFC',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(104, 87, 233, 0.15)', color: '#6857E9', fontSize: '11px', fontWeight: '800', marginBottom: '12px' }}>
            <Calculator size={13} />
            <span>50:50 ACPC MERIT FORMULA</span>
          </div>

          <div style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#C4C9DF' : '#5A607F' }}>
            Estimated Merit Score
          </div>

          <div style={{ fontSize: '42px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#1E1B4B', margin: '6px 0' }}>
            {estimatedMerit} <span style={{ fontSize: '20px', color: '#9DA3BC' }}>/ 100</span>
          </div>

          <p style={{ fontSize: '12.5px', color: isDark ? '#C4C9DF' : '#5A607F', lineHeight: 1.5, margin: 0 }}>
            Formula: (12th Board Theory % × 0.50) + ({form.entranceExam || 'GUJCET'} % × 0.50). This score is used for Gujarat centralized round 1 and round 2 seat allotments.
          </p>
        </div>

        <div
          style={{
            background: isDark ? 'rgba(24, 18, 48, 0.85)' : '#FFFFFF',
            borderRadius: '20px',
            padding: '20px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E5E9F2'
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#1E1B4B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} color="#10B981" />
            <span>Cutoff Bracket Compatibility</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFD' }}>
              <span style={{ color: isDark ? '#C4C9DF' : '#5A607F' }}>Tier-1 Autonomous (DA-IICT, Nirma):</span>
              <span style={{ fontWeight: '800', color: Number(estimatedMerit) >= 90 ? '#10B981' : '#FFA439' }}>
                {Number(estimatedMerit) >= 90 ? 'High Probability' : 'Moderate / Round 2'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFD' }}>
              <span style={{ color: isDark ? '#C4C9DF' : '#5A607F' }}>Premier Govt (LDCE, VGEC):</span>
              <span style={{ fontWeight: '800', color: Number(estimatedMerit) >= 80 ? '#10B981' : '#FFA439' }}>
                {Number(estimatedMerit) >= 80 ? 'Very High Probability' : 'Likely in Core Branches'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
