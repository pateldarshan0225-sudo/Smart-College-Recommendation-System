import React, { useState, useEffect } from 'react';
import '../styles/ruang-edit.css';
import { Navbar } from '../components/ruang-edit/Navbar';
import { HeroSection } from '../components/ruang-edit/HeroSection';
import { OurClassSection } from '../components/ruang-edit/OurClassSection';
import { CommunitySection } from '../components/ruang-edit/CommunitySection';
import { JoinUsModal } from '../components/ruang-edit/JoinUsModal';
import { ContactModal } from '../components/ruang-edit/ContactModal';
import { CurriculumModal } from '../components/ruang-edit/CurriculumModal';
import { ShowcaseModal } from '../components/ruang-edit/ShowcaseModal';
import { playSound, toggleSound, isSoundEnabled } from '../utils/audio';

export default function RuangEditLanding() {
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState('lavender');
  const [soundOn, setSoundOn] = useState(true);

  // Modals
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinTrack, setJoinTrack] = useState('all');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [curriculumModalOpen, setCurriculumModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('uiux');
  const [showcaseModalOpen, setShowcaseModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Ruang Edit - Level Up Your Design Class';
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'lavender' ? 'midnight' : 'lavender';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'class' || section === 'services') {
      const el = document.getElementById('class-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'about') {
      const el = document.getElementById('community-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenJoin = (track = 'all') => {
    setJoinTrack(track);
    setJoinModalOpen(true);
  };

  const handleOpenCurriculum = (courseId) => {
    setSelectedCourseId(courseId);
    setCurriculumModalOpen(true);
  };

  return (
    <div className="re-app-container" data-theme={theme}>
      {/* Dynamic Ambient Background Light Glow */}
      <div className="re-ambient-glow" />

      {/* Master Framed Container (Faithful to uploaded template) */}
      <main className="re-page-frame">
        {/* Navigation & Top Metadata Bar */}
        <Navbar
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenContact={() => setContactModalOpen(true)}
          onOpenShowcase={() => setShowcaseModalOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
        />

        {/* Hero Section */}
        <HeroSection
          onOpenJoin={() => handleOpenJoin('all')}
          onSelectTrack={(track) => handleOpenCurriculum(track)}
        />

        {/* Our Class 3-Cards Section */}
        <OurClassSection
          onOpenCurriculum={handleOpenCurriculum}
        />

        {/* Community, Reviews & Footer Card Section */}
        <CommunitySection
          onOpenJoin={() => handleOpenJoin('all')}
          onOpenContact={() => setContactModalOpen(true)}
          onOpenShowcase={() => setShowcaseModalOpen(true)}
        />
      </main>

      {/* Interactive Modals */}
      <JoinUsModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        defaultTrack={joinTrack}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      <CurriculumModal
        isOpen={curriculumModalOpen}
        onClose={() => setCurriculumModalOpen(false)}
        courseId={selectedCourseId}
        onEnroll={(track) => {
          setCurriculumModalOpen(false);
          handleOpenJoin(track);
        }}
      />

      <ShowcaseModal
        isOpen={showcaseModalOpen}
        onClose={() => setShowcaseModalOpen(false)}
      />
    </div>
  );
}
