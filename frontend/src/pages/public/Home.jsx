import { Link } from 'react-router-dom';
import HomeInformation, { HomeContact } from '../../components/HomeInformation.jsx';
export default function Home() {
  return <>
  <section className="hero">
    <div className="hero-copy">
      <p className="eyebrow"><span className="status-dot" /> BIG DREAMS. THE RIGHT DIRECTION.</p>
      <h1>Your future.<br />Your college.<br /><em>Your next chapter.</em></h1>
      <p className="hero-description">Turn your marks, interests and budget into a clearer path forward. Discover undergraduate colleges that fit you.</p>
      <div className="actions">
        <Link className="button" to="/register">Get Recommendations <span aria-hidden="true">↗</span></Link>
        <Link className="button secondary" to="/colleges">Explore colleges</Link>
      </div>
      <div className="hero-note"><span aria-hidden="true">✓</span> Free to explore <span aria-hidden="true">✓</span> Clear, rule-based matches</div>
    </div>
    <div className="hero-art">
      <div className="art-caption">A NEW BEGINNING AWAITS</div>
      <img src="/images/hero-campus.svg" alt="Illustration of a welcoming college campus with trees and an open pathway" />
      <div className="floating-card">
        <span className="mini-icon" aria-hidden="true">↗</span>
        <div>
          <strong>Find where you belong</strong>
          <small>A campus that fits your ambitions.</small>
        </div>
      </div>
      <span className="art-number">01 / YOUR JOURNEY</span>
    </div>
  </section>
  <section className="trust-strip">
    <span>MADE FOR YOUR NEXT STEP</span>
    <strong>Science</strong>
    <span aria-hidden="true">✦</span>
    <strong>Commerce</strong>
    <span aria-hidden="true">✦</span>
    <strong>Arts & Humanities</strong>
  </section>
  <nav className="home-section-nav" aria-label="Discover SmartCollege">
    <a href="#about">About us</a>
    <a href="#gallery">Gallery</a>
    <a href="#how-to-use">How to use</a>
    <a href="#contact">Contact us</a>
  </nav>
  <HomeInformation />
  <section id="how-to-use" className="section">
    <div className="section-header">
      <p className="eyebrow">HOW TO USE SMARTCOLLEGE</p>
      <h2>A little clarity goes a long way.</h2>
      <p>Three simple steps to make your college search feel manageable.</p>
    </div>
    <div className="steps">
      {[['01', 'Tell us about yourself', 'Add your 12th marks, entrance exam scores, preferred course and budget.'], ['02', 'Discover your matches', 'Compare eligible programmes with a clear score based on five simple factors.'], ['03', 'Make your next move', 'Explore campuses, save your favourites and build a shortlist you can come back to.']].map(([n, title, copy]) => <article className="step" key={n}>
        <span className="step-number">
          {n}
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5 19 19 5M5 5h14v14" />
          </svg>
        </span>
        <h3>
          {title}
        </h3>
        <p>
          {copy}
        </p>
      </article>)}
    </div>
  </section>
  <HomeContact />
  <section className="cta-banner">
    <div>
      <p className="eyebrow">YOUR POSSIBILITIES START HERE</p>
      <h2>Ready to find your fit?</h2>
      <p>Bring your aspirations. We’ll help you explore the options.</p>
    </div>
    <Link className="button light" to="/register">Register Now ↗</Link>
  </section>
</>;
}
