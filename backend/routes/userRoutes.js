import { Router } from 'express';
import { isUser } from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';
import * as profile from '../controllers/profileController.js';
import { changePassword, deleteAccount } from '../controllers/userController.js';
import { generate, listRecommendations } from '../controllers/recommendationController.js';
import * as shortlist from '../controllers/shortlistController.js';
import * as feedback from '../controllers/feedbackController.js';
const router = Router();
router.use(isUser);
router.get('/profile', profile.getProfile);
router.post('/profile', profile.saveProfile);
router.put('/profile', profile.saveProfile);
router.delete('/profile', profile.deleteProfile);
router.put('/password', changePassword);
router.delete('/account', deleteAccount);
router.post('/recommendations/generate', generate);
router.get('/recommendations', listRecommendations);
for (const [path, c] of Object.entries({
  shortlist,
  feedback
})) {
  router.get('/' + path, c.list);
  router.post('/' + path, c.create);
  router.put('/' + path + '/:id', validateObjectId, c.update);
  router.delete('/' + path + '/:id', validateObjectId, c.remove);
}
export default router;
