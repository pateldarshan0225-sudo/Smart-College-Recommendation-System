import College from '../models/College.js';
import CollegeCourse from '../models/CollegeCourse.js';
import CollegePlacement from '../models/CollegePlacement.js';
import CollegeFee from '../models/CollegeFee.js';
import CampusFacility from '../models/CampusFacility.js';
export async function list(req,res,next){try{const filter={status:'active'};if(req.query.search)filter.$or=[{name:new RegExp(req.query.search,'i')},{city:new RegExp(req.query.search,'i')},{state:new RegExp(req.query.search,'i')}];const data=await College.find(filter).sort({name:1});res.json({success:true,data});}catch(e){next(e)}}
export async function getOne(req,res,next){try{const college=await College.findById(req.params.id);if(!college)return res.status(404).json({success:false,message:'College not found'});const [collegeCourses,placement,fees,facilities]=await Promise.all([CollegeCourse.find({collegeId:college._id,status:'active'}).populate('courseId','courseName courseCode duration'),CollegePlacement.findOne({collegeId:college._id}),CollegeFee.find({collegeId:college._id}).populate('courseId','courseName'),CampusFacility.findOne({collegeId:college._id})]);res.json({success:true,data:{college, collegeCourses, placement, fees, facilities}});}catch(e){next(e)}}
export async function create(req,res,next){try{const data=await College.create(req.body);res.status(201).json({success:true,data});}catch(e){next(e)}}
export async function update(req,res,next){try{const data=await College.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!data)return res.status(404).json({success:false,message:'College not found'});res.json({success:true,data});}catch(e){next(e)}}
export async function remove(req,res,next){try{await College.findByIdAndDelete(req.params.id);res.json({success:true,message:'College deleted'});}catch(e){next(e)}}
