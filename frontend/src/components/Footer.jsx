import { Link } from 'react-router-dom';
export default function Footer() {
  return <footer>
  <div>
    <strong>SmartCollege</strong>
    <p>A clearer path from classroom to campus.</p>
  </div>
  <div>
    <Link to="/colleges">Explore colleges</Link>
    <a href="/#about">About us</a>
    <a href="/#gallery">Gallery</a>
    <a href="/#how-to-use">How to use</a>
    <a href="/#contact">Contact us</a>
    <Link to="/admin/login">Admin login</Link>
    <small>College minor project · Demonstration data, not admission advice.</small>
  </div>
</footer>;
}
