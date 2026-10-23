import { Link } from 'react-router-dom';
export default function NotFound() {
  return <div className="empty section">
  <p className="eyebrow">404 · PAGE NOT FOUND</p>
  <h1>A little off course?</h1>
  <p>Let’s get you back to your college journey.</p>
  <Link to="/" className="button">Back to home</Link>
</div>;
}
