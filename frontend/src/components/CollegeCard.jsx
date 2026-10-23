import { Link } from 'react-router-dom';
import PhotoCredit from './PhotoCredit.jsx';
export default function CollegeCard({
  college,
  children
}) {
  if (!college) return null;
  return <article className="college-card">
  <Link to={`/colleges/${college._id}`} className="college-image">
    <img src={college.image || '/images/college-placeholder.svg'} onError={e => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/images/college-placeholder.svg';
      }} alt={college.image ? `${college.name} campus` : `Campus photo unavailable for ${college.name}`} loading="lazy" />
    <span className="badge">
      {college.type}
    </span>
  </Link>
  <div className="college-body">
    <PhotoCredit college={college} />
    {college.isDemoData && <small className="block">Sample courses, fees and rating</small>}
    {college.selectionBasis && <small className="block">{college.selectionBasis}</small>}
    <div className="card-meta">
      <span>{college.city}, {college.state}</span>
      <strong>★ {college.rating}/5</strong>
    </div>
    <h3>
      <Link to={`/colleges/${college._id}`}>
        {college.name}
      </Link>
    </h3>
    <p>
      {college.affiliation}
    </p>
    {children}
    <Link className="text-link" to={`/colleges/${college._id}`}>Explore college <span aria-hidden="true">↗</span></Link>
  </div>
</article>;
}
