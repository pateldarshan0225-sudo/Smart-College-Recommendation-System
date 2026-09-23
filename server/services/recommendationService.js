import StudentProfile from '../models/StudentProfile.js';
import AcademicRecord from '../models/AcademicRecord.js';
import College from '../models/College.js';
import Course from '../models/Course.js';
import CollegeCourse from '../models/CollegeCourse.js';
import CollegePlacement from '../models/CollegePlacement.js';
import CollegeFee from '../models/CollegeFee.js';
import CampusFacility from '../models/CampusFacility.js';

const facilityMap = { 'Hostel':'hostel','Library':'library','Computer Lab':'computerLab','WiFi':'wifi','Sports':'sports','Gym':'gym','Cafeteria':'cafeteria','Transport':'transport','Medical Facility':'medicalFacility','Placement Cell':'placementCell' };

function academicScore(a){ if(!a) return 0; if(a.ugPercentage === null || a.ugPercentage === undefined || a.ugPercentage === '') return +(a.tenthPercentage*.4+a.twelfthPercentage*.6).toFixed(2); return +(a.tenthPercentage*.2+a.twelfthPercentage*.4+a.ugPercentage*.4).toFixed(2); }
function budgetScore(budget, fee){ if(!budget || budget<=0 || !fee) return 50; if(fee<=budget) return 100; return Math.max(0, +(100-(fee-budget)/budget*100).toFixed(2)); }
function locationScore(pref, college){ if(!pref || pref==='Any Location') return 100; const p=pref.toLowerCase(); if(p===String(college.city||'').toLowerCase()) return 100; if(p===String(college.state||'').toLowerCase()) return 60; return 20; }
function facilityScore(preferred, facilities){ if(!preferred?.length) return 100; const hits=preferred.filter(x=>facilities?.[facilityMap[x]]); return +(hits.length/preferred.length*100).toFixed(2); }
export async function calculateRecommendations(userId){
  const [profile, academic]=await Promise.all([StudentProfile.findOne({userId}).lean(),AcademicRecord.findOne({studentId:userId}).lean()]);
  if(!profile || !academic) { const e=new Error('Complete your profile and academic record first');e.status=400;throw e; }
  const course = profile.preferredCourse ? await Course.findById(profile.preferredCourse).lean() : null;
  const [colleges, collegeCourses, placements, fees, facilities]=await Promise.all([
    College.find({status:'active'}).lean(), CollegeCourse.find({status:'active'}).lean(), CollegePlacement.find().lean(), CollegeFee.find().lean(), CampusFacility.find().lean()
  ]);
  const courseById=new Map(collegeCourses.map(x=>[String(x._id),x]));
  const placementByCollege=new Map(placements.map(x=>[String(x.collegeId),x]));
  const facilityByCollege=new Map(facilities.map(x=>[String(x.collegeId),x]));
  const feeByCollegeCourse=new Map(fees.map(x=>[`${x.collegeId}:${x.courseId}`,x]));
  const academicSc=academicScore(academic);
  const results=[];
  for(const college of colleges){
    const matches=collegeCourses.filter(cc=>String(cc.collegeId)===String(college._id) && (!course || String(cc.courseId)===String(course._id)));
    if(course && matches.length===0) continue;
    const match=matches[0];
    const fee=match ? feeByCollegeCourse.get(`${college._id}:${match.courseId}`) : fees.find(f=>String(f.collegeId)===String(college._id));
    const placement=placementByCollege.get(String(college._id));
    const facilitiesData=facilityByCollege.get(String(college._id));
    const courseMatch=course ? 100 : 75;
    const budgetSc=budgetScore(profile.budget, fee?.totalAnnualFee||0);
    const placementSc=placement ? Math.min(100, +(placement.placementRate*.6 + Math.min(100,(placement.averagePackage/1000000)*100)*.4).toFixed(2)) : 0;
    const facilitySc=facilityScore(profile.preferredFacilities, facilitiesData);
    const locSc=locationScore(profile.preferredLocation,college);
    const overall=+(academicSc*.3+courseMatch*.2+placementSc*.2+budgetSc*.15+facilitySc*.1+locSc*.05).toFixed(2);
    const reasons=[];
    if(academicSc>=college.eligibilityPercentage) reasons.push('Your academic result meets the college eligibility.'); else reasons.push('Your academic score is below the listed eligibility threshold.');
    if(course) reasons.push('The college offers your preferred course.');
    if(budgetSc>=80) reasons.push('The annual fee is close to or within your budget.');
    if(placementSc>=70) reasons.push('The college has a strong placement score based on available placement data.');
    if(facilitySc>=70) reasons.push('Many of your preferred facilities are available.');
    if(locSc>=60) reasons.push('The college matches your preferred location.');
    results.push({college, courseMatch, academicScore:academicSc,budgetScore:budgetSc,placementScore:placementSc,facilityScore:facilitySc,locationScore:locSc,overallScore:overall,recommendationReason:reasons, fee, placement, facilities:facilitiesData, collegeCourse:match});
  }
  return results.sort((a,b)=>b.overallScore-a.overallScore);
}
