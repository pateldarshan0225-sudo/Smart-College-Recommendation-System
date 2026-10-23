import User from '../models/User.js';
import College from '../models/College.js';
import Course from '../models/Course.js';
import Feedback from '../models/Feedback.js';
import { ok } from '../utils/validation.js';
export async function dashboard(req, res) {
  const [users, colleges, courses, feedbacks, recentUsers, recentFeedbacks] = await Promise.all([User.countDocuments(), College.countDocuments(), Course.countDocuments(), Feedback.countDocuments(), User.find().sort({
    createdAt: -1
  }).limit(5), Feedback.find().populate('userId', 'name email').sort({
    createdAt: -1
  }).limit(5)]);
  ok(res, {
    users,
    colleges,
    courses,
    feedbacks,
    recentUsers,
    recentFeedbacks
  });
}
