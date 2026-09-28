import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ruang-edit.css';
import { CollegeNavbar } from '../components/college-reco/CollegeNavbar';
import { CollegeHeroSection } from '../components/college-reco/CollegeHeroSection';
import { CollegeEngineSection } from '../components/college-reco/CollegeEngineSection';
import { AdmissionsRoadmapSection } from '../components/college-reco/AdmissionsRoadmapSection';
import { StreamCareerExplorer } from '../components/college-reco/StreamCareerExplorer';
import { CollegeLeaderboardSection } from '../components/college-reco/CollegeLeaderboardSection';
import { ScholarshipCalculatorSection } from '../components/college-reco/ScholarshipCalculatorSection';
import { CollegeCommunitySection } from '../components/college-reco/CollegeCommunitySection';
import { QuickRecommendationModal } from '../components/college-reco/QuickRecommendationModal';
import { CollegeDetailModal } from '../components/college-reco/CollegeDetailModal';
import { CompareCollegesModal } from '../components/college-reco/CompareCollegesModal';
import { playSound, toggleSound } from '../utils/audio';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CollegeLanding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
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
    document.title = 'Smart College Recommendation System - AI College Advisor & Admissions Intelligence';
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
      console.log('Using local college data');
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
      console.log('Saved colleges fetch silent fail');
    }
  };

  const handleToggleSave = async (college) => {
    if (!user) {
      navigate('/login');
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

  const handleOpenAiMatcher = (moduleType) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setQuickMatchOpen(true);
  };

  const handleOpenCompare = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCompareModalOpen(true);
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

  // Real-time Scroll Spy for navigation active item
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = [
        { id: 'colleges-section', name: 'colleges' },
        { id: 'scholarships-section', name: 'scholarships' },
        { id: 'leaderboard-section', name: 'colleges' },
        { id: 'careers-section', name: 'careers' },
        { id: 'roadmap-section', name: 'roadmap' },
        { id: 'engine-section', name: 'engine' },
        { id: 'home-section', name: 'home' }
      ];

      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const handleNavigate = (section) => {
    setActiveSection(section);
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'engine') {
      const el = document.getElementById('engine-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'roadmap') {
      const el = document.getElementById('roadmap-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'careers') {
      const el = document.getElementById('careers-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'scholarships') {
      const el = document.getElementById('scholarships-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'colleges' || section === 'about') {
      const el = document.getElementById('colleges-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="re-app-container" data-theme={theme}>
      {/* Ambient Backlight Glow */}
      <div className="re-ambient-glow" />

      {/* Fixed Precision Luxury Navbar */}
      <CollegeNavbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenQuickMatch={handleOpenAiMatcher}
        onOpenCompare={handleOpenCompare}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
        collegesCount={colleges.length > 0 ? colleges.length : 500}
        savedCount={savedIds.length}
      />

      {/* Main Full-Width Page Frame */}
      <main className="re-page-frame">
        {/* 1. Hero Section with 4-Squircle Stream Carousel */}
        <div id="home-section">
          <CollegeHeroSection
            onOpenQuickMatch={handleOpenAiMatcher}
            onSelectStream={(stream) => {
              const el = document.getElementById('careers-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* 2. AI Recommendation Engine Feature Cards */}
        <div id="engine-section">
          <CollegeEngineSection
            onOpenQuickMatch={handleOpenAiMatcher}
          />
        </div>

        {/* 3. Step-by-Step Admissions & Counseling Roadmap */}
        <div id="roadmap-section">
          <AdmissionsRoadmapSection
            onOpenQuickMatch={handleOpenAiMatcher}
          />
        </div>

        {/* 4. Degree Streams & Career Pathways Intelligence */}
        <div id="careers-section">
          <StreamCareerExplorer
            onSelectCollege={(col) => setSelectedCollege(col)}
          />
        </div>

        {/* 5. Statewide University Leaderboard & Benchmarks */}
        <div id="leaderboard-section">
          <CollegeLeaderboardSection
            colleges={colleges}
            onSelectCollege={(col) => setSelectedCollege(col)}
            onOpenCompare={handleOpenCompare}
          />
        </div>

        {/* 6. Scholarship, MYSY & Fee Waiver Calculator */}
        <div id="scholarships-section">
          <ScholarshipCalculatorSection
            onOpenQuickMatch={handleOpenAiMatcher}
          />
        </div>

        {/* 7. Live College Directory Explorer & Community Section */}
        <div id="colleges-section">
          <CollegeCommunitySection
            colleges={colleges}
            savedIds={savedIds}
            onOpenQuickMatch={handleOpenAiMatcher}
            onOpenCollegeDetail={(col) => setSelectedCollege(col)}
            onOpenCompare={handleOpenCompare}
            onToggleSave={handleToggleSave}
          />
        </div>
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
