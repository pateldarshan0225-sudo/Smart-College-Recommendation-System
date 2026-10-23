import { Router } from 'express';
import { publicList, publicDetail, publicStates } from '../controllers/collegeController.js';
import { masterController } from '../controllers/streamController.js';
import validateObjectId from '../middleware/validateObjectId.js';
const router = Router();
router.get('/colleges', publicList);
router.get('/college-states', publicStates);
router.get('/colleges/:id', validateObjectId, publicDetail);
router.get('/streams', masterController('streams').listPublic);
router.get('/courses', masterController('courses').listPublic);
// Public exam names allow students to accurately complete their profiles.
router.get('/entrance-exams', masterController('entrance-exams').listPublic);
export default router;
