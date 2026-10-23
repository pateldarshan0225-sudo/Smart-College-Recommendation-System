import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import { ok, fail, text, email, password } from '../utils/validation.js';
import { cookieName, cookieOptions } from '../config/session.js';
const regenerate = req => new Promise((resolve, reject) => req.session.regenerate(e => e ? reject(e) : resolve()));
async function establish(req, record, role) {
  await regenerate(req);
  req.session.identity = {
    id: String(record._id),
    name: record.name,
    email: record.email,
    role
  };
  await new Promise((resolve, reject) => req.session.save(e => e ? reject(e) : resolve()));
  return req.session.identity;
}
export async function register(req, res) {
  const data = {
    name: text(req.body.name, 'Name', {
      max: 100
    }),
    email: email(req.body.email),
    password: await bcrypt.hash(password(req.body.password), Number(process.env.BCRYPT_ROUNDS || 12)),
    phone: text(req.body.phone, 'Phone', {
      required: false,
      max: 20
    })
  };
  if (data.phone && !/^\+?[0-9 ()-]{7,20}$/.test(data.phone)) fail('Enter a valid phone');
  const user = await User.create(data);
  ok(res, await establish(req, user, 'user'), 'Account created', 201);
}
async function signIn(req, res, Model, role) {
  const user = await Model.findOne({
    email: email(req.body.email)
  }).select('+password');
  const supplied = password(req.body.password);
  if (!user || !(await bcrypt.compare(supplied, user.password))) fail('Invalid email or password', 401);
  if (role === 'user' && user.isActive === false) fail('Your account is inactive. Please contact the administrator.', 403);
  ok(res, await establish(req, user, role), 'Logged in');
}
export const login = (req, res) => signIn(req, res, User, 'user');
export const adminLogin = (req, res) => signIn(req, res, Admin, 'admin');
export async function me(req, res) {
  const identity = req.session.identity;
  if (!identity) fail('Please log in', 401);
  const record = await (identity.role === 'admin' ? Admin : User).findById(identity.id);
  if (!record || identity.role === 'user' && record.isActive === false) {
    req.session.destroy(() => {});
    fail('Account is inactive or no longer exists', 401);
  }
  ok(res, {
    id: String(record._id),
    name: record.name,
    email: record.email,
    role: identity.role
  });
}
export async function logout(req, res) {
  await new Promise((resolve, reject) => req.session.destroy(e => e ? reject(e) : resolve()));
  res.clearCookie(cookieName, cookieOptions);
  ok(res, null, 'Logged out');
}
