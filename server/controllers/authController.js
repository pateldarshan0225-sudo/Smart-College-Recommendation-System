import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { clearRefreshCookie, setRefreshCookie, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';

export async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, phone, role: 'user' });
    const safe = await User.findById(user._id).select('-password');
    const accessToken = signAccessToken(user);
    setRefreshCookie(res, signRefreshToken(user));
    res.status(201).json({ success: true, message: 'Registration successful', data: { user: safe, accessToken } });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (user.status !== 'active') return res.status(403).json({ success: false, message: 'Account is inactive' });
    setRefreshCookie(res, signRefreshToken(user));
    const safe = user.toObject(); delete safe.password;
    res.json({ success: true, message: 'Login successful', data: { user: safe, accessToken: signAccessToken(user) } });
  } catch (e) { next(e); }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'Refresh token missing' });
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);
    if (!user || user.status !== 'active') return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    setRefreshCookie(res, signRefreshToken(user));
    res.json({ success: true, data: { accessToken: signAccessToken(user), user } });
  } catch (e) { res.status(401).json({ success: false, message: 'Invalid or expired refresh token' }); }
}

export async function logout(req, res) {
  clearRefreshCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
}

export async function me(req, res) {
  res.json({ success: true, data: { user: req.user } });
}
