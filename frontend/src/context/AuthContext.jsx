import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios.js';
const AuthContext = createContext(null);
export function AuthProvider({
  children
}) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    api.get('/auth/me').then(r => {
      if (active) setUser(r.data.data);
    }).catch(() => {}).finally(() => {
      if (active) setLoading(false);
    });
    const expire = () => setUser(null);
    window.addEventListener('auth-expired', expire);
    return () => {
      active = false;
      window.removeEventListener('auth-expired', expire);
    };
  }, []);
  async function login(path, values) {
    const r = await api.post(path, values);
    setUser(r.data.data);
    return r.data.data;
  }
  async function logout() {
    await api.post('/auth/logout');
    setUser(null);
  }
  return <AuthContext.Provider value={{
    user,
    loading,
    login,
    logout,
    setUser
  }}>
  {children}
</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
