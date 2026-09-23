import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api',withCredentials:true});
let accessToken=null; export const setAccessToken=t=>{accessToken=t}; export const getAccessToken=()=>accessToken;
api.interceptors.request.use(config=>{if(accessToken)config.headers.Authorization=`Bearer ${accessToken}`;return config});
let refreshing=null;
api.interceptors.response.use(r=>r,async error=>{const original=error.config;if(error.response?.status===401&&!original._retry&&!original.url?.includes('/auth/refresh')){original._retry=true;try{refreshing=refreshing||api.post('/auth/refresh');const r=await refreshing;refreshing=null;setAccessToken(r.data.data.accessToken);original.headers.Authorization=`Bearer ${getAccessToken()}`;return api(original);}catch(e){refreshing=null;setAccessToken(null);}}return Promise.reject(error)});
export default api;
