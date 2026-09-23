import {createContext,useContext,useEffect,useState} from 'react'; import api,{setAccessToken} from '../services/api';
const AuthContext=createContext(null); const SESSION_MARKER='smart-college-session'; export const useAuth=()=>useContext(AuthContext);
export function AuthProvider({children}){const [user,setUser]=useState(null);const [loading,setLoading]=useState(true);
useEffect(()=>{if(!localStorage.getItem(SESSION_MARKER)){setLoading(false);return}(async()=>{try{const r=await api.post('/auth/refresh');setAccessToken(r.data.data.accessToken);setUser(r.data.data.user)}catch{localStorage.removeItem(SESSION_MARKER);setUser(null)}finally{setLoading(false)}})()},[]);
const login=async(form)=>{const r=await api.post('/auth/login',form);localStorage.setItem(SESSION_MARKER,'1');setAccessToken(r.data.data.accessToken);setUser(r.data.data.user);return r.data.data.user};
const register=async(form)=>{const r=await api.post('/auth/register',form);localStorage.setItem(SESSION_MARKER,'1');setAccessToken(r.data.data.accessToken);setUser(r.data.data.user);return r.data.data.user};
const logout=async()=>{try{await api.post('/auth/logout')}finally{localStorage.removeItem(SESSION_MARKER);setAccessToken(null);setUser(null)}}; return <AuthContext.Provider value={{user,loading,login,register,logout}}>{children}</AuthContext.Provider>}
