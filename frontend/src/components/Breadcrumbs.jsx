import { Link, useLocation } from 'react-router-dom';
export default function Breadcrumbs() {
  const {
    pathname
  } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  return <nav className="breadcrumbs" aria-label="Breadcrumb">
  <Link to="/">Home</Link>
  {parts.map((part, i) => <span key={i}> / {part.length === 24 ? 'Details' : part.replaceAll('-', ' ')}</span>)}
</nav>;
}
