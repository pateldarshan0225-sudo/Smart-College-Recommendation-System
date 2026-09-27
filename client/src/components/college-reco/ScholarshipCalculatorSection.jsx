import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Award, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const ScholarshipCalculatorSection = ({ onOpenQuickMatch }) => {
  const [boardMarks, setBoardMarks] = useState(84);
  const [annualIncome, setAnnualIncome] = useState(4.5);
  const [selectedScheme, setSelectedScheme] = useState('mysy');

  // Calculation rules
  const isMysyEligible = boardMarks >= 80 && annualIncome <= 6.0;
  const isTfwsEligible = boardMarks >= 85 && annualIncome <= 8.0;

  const getSavingsEstimate = () => {
    if (selectedScheme === 'mysy') {
      return isMysyEligible ? 200000 : 0; // ₹50k x 4 yrs
    } else if (selectedScheme === 'tfws') {
      return isTfwsEligible ? 600000 : 0; // ~₹1.5L x 4 yrs 100% waiver
    } else if (selectedScheme === 'digital_gujarat') {
      return 400000;
    }
    return 150000;
  };

  const totalSavings = getSavingsEstimate();

  return (
    <section className="re-class-section-wrapper" style={{ padding: '40px 36px', marginBottom: '36px' }} aria-label="Scholarship & Fee Waiver Calculator">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="re-interactive-badge" style={{ marginBottom: '8px' }}>
            <DollarSign size={12} /> FINANCIAL AID & FEE WAIVERS
          </div>
          <h2 className="re-section-title">
            Scholarship & Tuition Fee Waiver Calculator
          </h2>
        </div>
        <p className="re-section-subtitle">
          Calculate eligibility for government MYSY, TFWS 100% waiver, and institutional merit scholarships.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Interactive Calculator Inputs */}
        <div style={{ background: 'var(--re-bg-surface-subtle)', border: '1px solid var(--re-border-subtle)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: 'var(--re-text-primary)', marginBottom: '6px' }}>
              <span>12th Science / HSC Marks:</span>
              <strong style={{ color: 'var(--re-accent-purple)', fontSize: '15px' }}>{boardMarks}%</strong>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={boardMarks}
              onChange={(e) => {
                playSound('tap');
                setBoardMarks(Number(e.target.value));
              }}
              style={{ width: '100%', accentColor: 'var(--re-accent-purple)' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--re-text-muted)', marginTop: '4px' }}>
              Requirement: MYSY requires ≥80% • TFWS requires top 5% merit
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: 'var(--re-text-primary)', marginBottom: '6px' }}>
              <span>Annual Family Income:</span>
              <strong style={{ color: 'var(--re-accent-amber)', fontSize: '15px' }}>₹{annualIncome} Lakhs / yr</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="12.0"
              step="0.5"
              value={annualIncome}
              onChange={(e) => {
                playSound('tap');
                setAnnualIncome(Number(e.target.value));
              }}
              style={{ width: '100%', accentColor: 'var(--re-accent-amber)' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--re-text-muted)', marginTop: '4px' }}>
              Income ceiling: MYSY limit ₹6.0 LPA • TFWS limit ₹8.0 LPA
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--re-text-primary)', marginBottom: '8px' }}>
              Select Scholarship Program
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { id: 'mysy', name: 'MYSY (50% Tuition Waiver)' },
                { id: 'tfws', name: 'TFWS (100% Tuition Waiver)' },
                { id: 'digital_gujarat', name: 'Digital Gujarat SC/ST/SEBC' },
                { id: 'merit', name: 'University Merit Fellowship' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    playSound('pop');
                    setSelectedScheme(s.id);
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1.5px solid ${selectedScheme === s.id ? 'var(--re-accent-purple)' : 'var(--re-border-subtle)'}`,
                    background: selectedScheme === s.id ? '#FFFFFF' : 'transparent',
                    color: selectedScheme === s.id ? 'var(--re-accent-purple)' : 'var(--re-text-secondary)',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Eligibility & Savings Card */}
        <div style={{
          background: 'linear-gradient(145deg, #745eae 0%, #60489b 100%)',
          color: '#FFFFFF',
          borderRadius: '20px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 16px 36px rgba(112, 90, 168, 0.3)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, background: '#FFA439', color: '#1A1433', padding: '3px 12px', borderRadius: '999px' }}>
                LIVE FINANCIAL AUDIT
              </span>
              <span style={{ fontSize: '12px', color: '#E4DDF7' }}>4-Year B.Tech Degree</span>
            </div>

            <div style={{ fontSize: '13px', color: '#E4DDF7', marginBottom: '4px' }}>
              Estimated 4-Year Tuition Savings
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', marginBottom: '16px' }}>
              {totalSavings > 0 ? `₹${(totalSavings / 100000).toFixed(1)} Lakhs` : '₹0 (Criteria Not Met)'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#F2EDFA', background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {boardMarks >= 80 ? <CheckCircle2 size={15} color="#35C7B8" /> : <AlertCircle size={15} color="#FFA439" />}
                <span>12th Board Score ({boardMarks}%): {boardMarks >= 80 ? 'Meets 80% Cutoff ✓' : 'Below 80% threshold'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {annualIncome <= 6.0 ? <CheckCircle2 size={15} color="#35C7B8" /> : <AlertCircle size={15} color="#FFA439" />}
                <span>Income Limit (₹{annualIncome}L): {annualIncome <= 6.0 ? 'Eligible for MYSY Grant ✓' : 'Exceeds standard ceiling'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('pop');
              if (onOpenQuickMatch) onOpenQuickMatch();
            }}
            style={{
              marginTop: '20px',
              padding: '12px',
              borderRadius: 'var(--re-radius-pill)',
              border: 'none',
              background: '#FFA439',
              color: '#1A1433',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(255, 164, 57, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            Find TFWS & Low Fee Colleges 🚀
          </button>
        </div>
      </div>
    </section>
  );
};
