import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const gallery = [
  ['https://images.pexels.com/photos/8199143/pexels-photo-8199143.jpeg?auto=compress&cs=tinysrgb&w=1000', 'College classrooms', 'Learn, discuss and discover new perspectives together.', 'College students studying together in a classroom'],
  ['https://images.pexels.com/photos/3747478/pexels-photo-3747478.jpeg?auto=compress&cs=tinysrgb&w=1000', 'Computer labs', 'Turn ideas into practical skills with hands-on learning.', 'Computer lab with desktop workstations arranged on tables'],
  ['https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=80', 'Campus libraries', 'Find a quiet corner for research, reading and discovery.', 'Library shelves filled with books']
];

export default function HomeInformation() {
  return <>
    <section id="about" className="section home-about">
      <div>
        <p className="eyebrow">ABOUT US</p>
        <h2>A clearer start.<br />A more confident next step.</h2>
        <p>Choosing what comes after Class 12 can feel overwhelming. SmartCollege brings courses, college information and your preferences together so you can explore your options at your own pace.</p>
        <Link className="button secondary" to="/colleges">Find your possibilities ↗</Link>
      </div>
      <div className="home-values">
        <article><span>01 / EXPLORE</span><h3>Your priorities come first.</h3><p>Search by college name, state, course and maximum fees to focus on what matters to you.</p></article>
        <article><span>02 / UNDERSTAND</span><h3>Clarity behind every match.</h3><p>Recommendations use your marks, budget, preferences and entrance exam details, with an explained match score.</p></article>
        <article><span>03 / DECIDE</span><h3>Keep your options together.</h3><p>Save colleges to your shortlist and revisit them as your plans take shape.</p></article>
      </div>
    </section>
    <section id="gallery" className="section home-gallery">
      <div className="section-header"><p className="eyebrow">THE CAMPUS CHAPTER</p><h2>Picture the possibilities.</h2><p>Places to learn, people to meet and ideas to discover.</p></div>
      <div className="home-gallery-grid">{gallery.map(([photo, title, copy, alt]) => <figure key={photo}>
        <img src={photo} alt={alt} loading="lazy" onError={event => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = '/images/hero-campus.svg';
        }} />
        <figcaption><h3>{title}</h3><p>{copy}</p></figcaption>
      </figure>)}</div>
      <p className="home-image-note">Illustrative photos for inspiration; these do not represent specific colleges listed on SmartCollege.</p>
    </section>
  </>;
}

export function HomeContact() {
  const { user } = useAuth();
  return <section id="contact" className="section home-contact">
    <div><p className="eyebrow">CONTACT US</p><h2>Your questions.<br />Your ideas. We’re listening.</h2><p>Found an issue, have a suggestion or want to share your experience? Send a message through your student workspace.</p>
      <Link className="button" to={user?.role === 'user' ? '/user/feedback' : '/login'}>{user?.role === 'user' ? 'Send feedback ↗' : 'Log in to send feedback ↗'}</Link>
      {user?.role === 'admin' && <p className="home-image-note">Use a student account to submit feedback. You can review messages in your admin workspace.</p>}
    </div>
    <div className="home-faq"><h3>A little help before you begin.</h3>
      <details><summary>Can I explore without an account?</summary><p>Yes. Browse colleges and filter by state, course and budget. Create an account to get recommendations and save a shortlist.</p></details>
      <details><summary>Where can I find my saved matches?</summary><p>Open Recommendations in your student workspace to review saved matches and their scores. Keep your profile details up to date; changing your profile clears outdated matches.</p></details>
      <details><summary>Does a match guarantee admission?</summary><p>No. This is a demonstration project using sample college data. Verify fees, eligibility, deadlines and admission requirements directly with the institution.</p></details>
    </div>
  </section>;
}
