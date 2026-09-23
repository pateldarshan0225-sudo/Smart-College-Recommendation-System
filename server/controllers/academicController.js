import AcademicRecord from '../models/AcademicRecord.js';
export async function getAcademic(req,res,next){try{const data=await AcademicRecord.findOne({studentId:req.user._id});res.json({success:true,data});}catch(e){next(e)}}
export async function upsertAcademic(req,res,next){try{const data=await AcademicRecord.findOneAndUpdate({studentId:req.user._id},{...req.body,studentId:req.user._id},{new:true,upsert:true,setDefaultsOnInsert:true,runValidators:true});res.json({success:true,message:'Academic record saved',data});}catch(e){next(e)}}
