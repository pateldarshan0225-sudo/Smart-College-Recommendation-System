import { Router } from 'express';
import { isAdmin } from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';
import { dashboard } from '../controllers/dashboardController.js';
import streams from '../controllers/streamController.js';
import courses from '../controllers/courseController.js';
import exams from '../controllers/entranceExamController.js';
import colleges from '../controllers/collegeController.js';
import offerings from '../controllers/collegeCourseController.js';
import { listUsers, deleteUser } from '../controllers/userController.js';
import User from '../models/User.js';
import { statusController } from '../utils/activeRecords.js';
import * as feedback from '../controllers/feedbackController.js';
const router = Router();
router.use(isAdmin);
router.get('/dashboard', dashboard);
for (const [path, c] of Object.entries({
  streams,
  courses,
  'entrance-exams': exams,
  colleges,
  'college-courses': offerings
})) {
  router.get('/' + path, c.list);
  router.post('/' + path, c.create);
  router.get('/' + path + '/:id', validateObjectId, c.get);
  router.put('/' + path + '/:id', validateObjectId, c.update);
  router.put('/' + path + '/:id/status', validateObjectId, c.setStatus);
  router.delete('/' + path + '/:id', validateObjectId, c.remove);
}
router.get('/users', listUsers);
router.put('/users/:id/status', validateObjectId, statusController(User));
router.delete('/users/:id', validateObjectId, deleteUser);
router.get('/feedbacks', feedback.list);
router.delete('/feedbacks/:id', validateObjectId, feedback.remove);
export default router;
