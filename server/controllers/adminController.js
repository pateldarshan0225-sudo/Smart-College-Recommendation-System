import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import AcademicRecord from '../models/AcademicRecord.js';
import College from '../models/College.js';
import Course from '../models/Course.js';
import CollegeCourse from '../models/CollegeCourse.js';
import CollegePlacement from '../models/CollegePlacement.js';
import CollegeFee from '../models/CollegeFee.js';
import CampusFacility from '../models/CampusFacility.js';
import SavedCollege from '../models/SavedCollege.js';
import Recommendation from '../models/Recommendation.js';
import bcrypt from 'bcryptjs';

const models = { users: User, student_profiles: StudentProfile, academic_records: AcademicRecord, colleges: College, courses: Course, college_courses: CollegeCourse, college_placements: CollegePlacement, college_fees: CollegeFee, campus_facilities: CampusFacility, saved_colleges: SavedCollege, recommendations: Recommendation };
const populate = { student_profiles: 'preferredCourse', academic_records: 'studentId', college_courses: ['collegeId','courseId'], college_placements: 'collegeId', college_fees: ['collegeId','courseId'], campus_facilities: 'collegeId', saved_colleges: ['studentId','collegeId'], recommendations: ['studentId','collegeId'] };
function modelFor(entity){ const Model=models[entity]; if(!Model){const e=new Error('Unknown entity');e.status=400;throw e;} return Model; }
function sanitize(entity, body){ const data={...body}; delete data._id; delete data.__v; return data; }
function q(Model, entity){ let query=Model.find(); const p=populate[entity]; if(p){for(const x of Array.isArray(p)?p:[p]) query=query.populate(x);} return query.sort({createdAt:-1}); }
export async function list(req,res,next){try{const Model=modelFor(req.params.entity); const data=await q(Model,req.params.entity); res.json({success:true,data:await data});}catch(e){next(e)}}
export async function getOne(req,res,next){try{const entity=req.params.entity;const Model=modelFor(entity);let query=Model.findById(req.params.id);const p=populate[entity];if(p){for(const x of Array.isArray(p)?p:[p])query=query.populate(x)}const data=await query;if(!data)return res.status(404).json({success:false,message:'Record not found'});res.json({success:true,data});}catch(e){next(e)}}
export async function create(req,res,next){try{const entity=req.params.entity;const Model=modelFor(entity);const payload=sanitize(entity,req.body);if(entity==='users'){if(!payload.password) return res.status(400).json({success:false,message:'Password is required for a new user'});payload.password=await bcrypt.hash(payload.password,12);}const created=await Model.create(payload);const data=entity==='users'?await Model.findById(created._id).select('-password'):created;res.status(201).json({success:true,message:'Record created',data});}catch(e){next(e)}}
export async function update(req,res,next){try{const entity=req.params.entity;const Model=modelFor(entity);const payload=sanitize(entity,req.body);if(entity==='users'){if(payload.password) payload.password=await bcrypt.hash(payload.password,12); else delete payload.password;}const updated=await Model.findByIdAndUpdate(req.params.id,payload,{new:true,runValidators:true});if(!updated)return res.status(404).json({success:false,message:'Record not found'});const data=entity==='users'?await Model.findById(updated._id).select('-password'):updated;res.json({success:true,message:'Record updated',data});}catch(e){next(e)}}
export async function remove(req,res,next){try{const Model=modelFor(req.params.entity);const data=await Model.findByIdAndDelete(req.params.id);if(!data)return res.status(404).json({success:false,message:'Record not found'});res.json({success:true,message:'Record deleted'});}catch(e){next(e)}}
export async function dashboard(req, res, next) {
  try {
    const entries = await Promise.all(Object.entries(models).map(async ([key, M]) => [key, await M.countDocuments()]));
    const counts = Object.fromEntries(entries);

    // 1. Placement statistics from CollegePlacement
    const placementAgg = await CollegePlacement.aggregate([
      {
        $group: {
          _id: null,
          avgPackage: { $avg: '$averagePackage' },
          maxPackage: { $max: '$highestPackage' },
          avgPlacementRate: { $avg: '$placementRate' },
          totalDrives: { $sum: 1 }
        }
      }
    ]);
    const placementData = placementAgg[0] || {};
    const placementStats = {
      avgLPA: placementData.avgPackage ? (placementData.avgPackage / 100000).toFixed(1) : '0.0',
      maxLPA: placementData.maxPackage ? (placementData.maxPackage / 100000).toFixed(1) : '0.0',
      avgPlacementRate: Math.round(placementData.avgPlacementRate || 0),
      totalDrives: placementData.totalDrives || counts.college_placements || 0
    };

    // 2. Colleges statistics
    const activeCollegesCount = await College.countDocuments({ status: 'active' });
    const ratingAgg = await College.aggregate([
      { $match: { collegeRating: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$collegeRating' } } }
    ]);
    const avgRating = ratingAgg[0]?.avgRating ? Number(ratingAgg[0].avgRating.toFixed(1)) : 4.2;

    // 3. Live Colleges for map & widgets
    const liveColleges = await College.find()
      .select('name city state collegeRating collegeType establishedYear')
      .sort({ collegeRating: -1 })
      .limit(6);

    // 4. Real Recent Activities
    const [recentUsers, recentSaved, recentRecs] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      SavedCollege.find().sort({ createdAt: -1 }).limit(5).populate('studentId', 'name email').populate('collegeId', 'name city'),
      Recommendation.find().sort({ createdAt: -1 }).limit(5).populate('studentId', 'name email').populate('collegeId', 'name city')
    ]);

    const activities = [];
    for (const u of recentUsers) {
      activities.push({
        id: String(u._id),
        name: u.name || u.email.split('@')[0],
        action: `Registered new account (${u.role || 'student'})`,
        time: u.createdAt,
        type: 'user'
      });
    }

    for (const s of recentSaved) {
      if (s.studentId && s.collegeId) {
        activities.push({
          id: String(s._id),
          name: s.studentId.name || 'Student',
          action: `Shortlisted ${s.collegeId.name}`,
          time: s.createdAt,
          type: 'saved'
        });
      }
    }

    for (const r of recentRecs) {
      if (r.studentId && r.collegeId) {
        activities.push({
          id: String(r._id),
          name: r.studentId.name || 'Student',
          action: `Generated match for ${r.collegeId.name}`,
          time: r.createdAt,
          type: 'recommendation'
        });
      }
    }

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Active staff/users
    const onlineUsers = await User.find({ status: { $ne: 'inactive' } })
      .limit(5)
      .select('name email role createdAt');

    res.json({
      success: true,
      data: {
        ...counts,
        counts,
        placementStats,
        collegesStats: {
          total: counts.colleges || 0,
          active: activeCollegesCount || counts.colleges || 0,
          avgRating
        },
        facilitiesStats: {
          totalAudited: counts.campus_facilities || 0
        },
        liveColleges,
        activities: activities.slice(0, 6),
        onlineUsers
      }
    });
  } catch (e) {
    next(e);
  }
}

