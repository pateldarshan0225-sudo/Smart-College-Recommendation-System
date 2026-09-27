import React, { useState, useEffect } from 'react';
import '../styles/ruang-edit.css';
import { CollegeNavbar } from '../components/college-reco/CollegeNavbar';
import { CollegeLeaderboardSection } from '../components/college-reco/CollegeLeaderboardSection';
import { CollegeCommunitySection } from '../components/college-reco/CollegeCommunitySection';
import { QuickRecommendationModal } from '../components/college-reco/QuickRecommendationModal';
import { CollegeDetailModal } from '../components/college-reco/CollegeDetailModal';
import { CompareCollegesModal } from '../components/college-reco/CompareCollegesModal';
import { playSound, toggleSound } from '../utils/audio';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Building2, Search, Filter, Sparkles, MapPin, Award, ArrowUpRight, Scale, Bookmark, CheckCircle2 } from 'lucide-react';

export default function CollegesPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState('lavender');
  const [soundOn, setSoundOn] = useState(true);

  // Data from backend
  const [colleges, setColleges] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [quickMatchOpen, setQuickMatchOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Colleges Directory & University Leaderboards - Smart College';
    window.scrollTo(0, 0);
    fetchColleges();
    if (user) {
      fetchSavedColleges();
    }
  }, [user]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const res = await api.get('/colleges');
      if (res.data?.data) {
        setColleges(res.data.data);
      }
    } catch (err) {
      console.log('Using local college directory');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedColleges = async () => {
    try {
      const res = await api.get('/saved-colleges');
      if (res.data?.data) {
        setSavedIds(res.data.data.map((item) => item.collegeId?._id || item.collegeId));
      }
    } catch (err) {
      console.log('Saved colleges silent fetch');
    }
  };

  const handleToggleSave = async (college) => {
    if (!user) {
      setQuickMatchOpen(true);
      return;
    }
    const id = college._id;
    const isCurrentlySaved = savedIds.includes(id);
    if (isCurrentlySaved) {
      setSavedIds(savedIds.filter((sId) => sId !== id));
      try {
        await api.delete(`/saved-colleges/${id}`);
      } catch (err) {}
    } else {
      setSavedIds([...savedIds, id]);
      try {
        await api.post('/saved-colleges', { collegeId: id });
      } catch (err) {}
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'lavender' ? 'midnight' : 'lavender';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  return (
    <div className="re-app-container" data-theme={theme}>
      {/* Ambient Backlight */}
      <div className="re-ambient-glow" />

      {/* Fixed Luxury Precision Navbar */}
      <CollegeNavbar
        activeSection="colleges"
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
        onOpenQuickMatch={() => setQuickMatchOpen(true)}
        onOpenCompare={() => setCompareModalOpen(true)}
        collegesCount={colleges.length > 0 ? colleges.length : 500}
        savedCount={savedIds.length}
      />

      <main className="re-page-frame">
        {/* Page Hero Header Banner */}
        <section className="re-hero-section" style={{ padding: '36px 28px', marginBottom: '28px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(124, 109, 175, 0.12)', color: 'var(--re-accent-purple)', fontSize: '11.5px', fontWeight: '800', marginBottom: '12px' }}>
                <Building2 size={13} />
                <span>STATEWIDE & NATIONAL DIRECTORY</span>
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--re-text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2, margin: '0 0 10px 0' }}>
                Explore 500+ Accredited Colleges & NIRF Benchmarks
              </h1>
              <p style={{ fontSize: '14.5px', color: 'var(--re-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Filter across engineering institutes, management universities, and computing campuses. Compare real NAAC accreditations, median CTC placement records, and ACPC cutoff percentiles.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="re-nav-primary-action-btn"
                onClick={() => {
                  playSound('pop');
                  setQuickMatchOpen(true);
                }}
                style={{ padding: '10px 18px', fontSize: '13.5px' }}
              >
                <Sparkles size={15} />
                <span>Run AI Matcher for Me</span>
              </button>

              <button
                className="re-mobile-compare-btn"
                onClick={() => {
                  playSound('click');
                  setCompareModalOpen(true);
                }}
                style={{ padding: '10px 18px', fontSize: '13.5px', width: 'auto' }}
              >
                <Scale size={15} />
                <span>Side-by-Side Comparison</span>
              </button>
            </div>
          </div>
        </section>

        {/* 1. Statewide University Leaderboard & Benchmarks */}
        <CollegeLeaderboardSection
          colleges={colleges}
          onSelectCollege={(col) => setSelectedCollege(col)}
          onOpenCompare={() => setCompareModalOpen(true)}
        />

        {/* 2. Interactive Directory Cards Explorer */}
        <CollegeCommunitySection
          colleges={colleges}
          savedIds={savedIds}
          onOpenQuickMatch={() => setQuickMatchOpen(true)}
          onOpenCollegeDetail={(col) => setSelectedCollege(col)}
          onOpenCompare={() => setCompareModalOpen(true)}
          onToggleSave={handleToggleSave}
        />
      </main>

      {/* Interactive Modals */}
      <QuickRecommendationModal
        isOpen={quickMatchOpen}
        onClose={() => setQuickMatchOpen(false)}
        colleges={colleges}
        onSelectCollege={(col) => setSelectedCollege(col)}
      />

      <CollegeDetailModal
        isOpen={!!selectedCollege}
        onClose={() => setSelectedCollege(null)}
        college={selectedCollege}
        onSaveCollege={handleToggleSave}
        isSaved={selectedCollege && savedIds.includes(selectedCollege._id)}
      />

      <CompareCollegesModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        colleges={colleges}
      />
    </div>
  );
}
