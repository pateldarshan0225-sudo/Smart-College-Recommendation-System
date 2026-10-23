import { useState } from 'react';
export default function PasswordInput(props) {
  const [visible, setVisible] = useState(false);
  return <div className="password-wrap">
  <input {...props} type={visible ? 'text' : 'password'} />
  <button type="button" className="password-toggle" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>
    {visible ? 'Hide' : 'Show'}
  </button>
</div>;
}
