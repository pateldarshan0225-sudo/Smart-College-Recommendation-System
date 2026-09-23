import { Router } from 'express';
import Course from '../models/Course.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
const r=Router();
r.get('/',async(req,res,next)=>{try{const data=await Course.find({status:'active'}).sort({courseName:1});res.json({success:true,data});}catch(e){next(e)}});
r.post('/',authenticate,authorizeAdmin,async(req,res,next)=>{try{const data=await Course.create(req.body);res.status(201).json({success:true,data});}catch(e){next(e)}});
r.put('/:id',authenticate,authorizeAdmin,async(req,res,next)=>{try{const data=await Course.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!data)return res.status(404).json({success:false,message:'Course not found'});res.json({success:true,data});}catch(e){next(e)}});
r.delete('/:id',authenticate,authorizeAdmin,async(req,res,next)=>{try{await Course.findByIdAndDelete(req.params.id);res.json({success:true,message:'Course deleted'});}catch(e){next(e)}});
export default r;
