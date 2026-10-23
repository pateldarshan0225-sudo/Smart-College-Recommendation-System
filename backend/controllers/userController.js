import bcrypt from 'bcrypt';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Recommendation from '../models/Recommendation.js';
import Shortlist from '../models/Shortlist.js';
import Feedback from '../models/Feedback.js';
import { ok, fail, password } from '../utils/validation.js';
import { paginate } from '../utils/pagination.js';
import { logout } from './authController.js';
export async function listUsers(req, res) {
  ok(res, await paginate(User, {}, req.query));
}
async function removeUser(userId) {
  const found = await User.findById(userId);
  if (!found) fail('User not found', 404);
  await Promise.all([StudentProfile.deleteMany({
    userId
  }), Recommendation.deleteMany({
    userId
  }), Shortlist.deleteMany({
    userId
  }), Feedback.deleteMany({
    userId
  })]);
  await found.deleteOne();
}
export async function deleteUser(req, res) {
  await removeUser(req.params.id);
  ok(res, null, 'User and owned records deleted');
}
export async function changePassword(req, res) {
  const user = await User.findById(req.session.identity.id).select('+password');
  if (!user) fail('User not found', 404);
  if (typeof req.body.currentPassword !== 'string' || !(await bcrypt.compare(req.body.currentPassword, user.password))) fail('Current password is incorrect');
  user.password = await bcrypt.hash(password(req.body.newPassword), Number(process.env.BCRYPT_ROUNDS || 12));
  await user.save();
  ok(res, null, 'Password changed');
}
export async function deleteAccount(req, res) {
  const user = await User.findById(req.session.identity.id).select('+password');
  if (!user) fail('User not found', 404);
  if (typeof req.body.password !== 'string' || !(await bcrypt.compare(req.body.password, user.password))) fail('Password is incorrect');
  await removeUser(String(user._id));
  await logout(req, res);
}
