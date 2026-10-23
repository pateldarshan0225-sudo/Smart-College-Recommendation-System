import { NavLink } from 'react-router-dom';
const admin = [['', 'Overview'], ['streams', 'Streams'], ['courses', 'Courses'], ['entrance-exams', 'Entrance exams'], ['colleges', 'Colleges'], ['college-courses', 'College courses'], ['users', 'Users'], ['feedbacks', 'Feedback']];
const student = [['', 'Overview'], ['profile', 'My profile'], ['recommendations', 'Recommendations'], ['shortlist', 'My shortlist'], ['feedback', 'Feedback']];
export default function Sidebar({
  role = 'user'
}) {
  return <aside className="sidebar">
  <p className="eyebrow">
    {role === 'admin' ? 'ADMIN WORKSPACE' : 'STUDENT WORKSPACE'}
  </p>
  <nav aria-label="Workspace navigation">
    {(role === 'admin' ? admin : student).map(([path, label]) => <NavLink end to={`/${role}${path ? '/' + path : ''}`} key={label}>
      <span aria-hidden="true">
        {path ? '◇' : '▦'}
      </span>
      {label}
    </NavLink>)}
  </nav>
  <div className="sidebar-note">Your future starts<br /><strong>with a little clarity.</strong></div>
</aside>;
}
