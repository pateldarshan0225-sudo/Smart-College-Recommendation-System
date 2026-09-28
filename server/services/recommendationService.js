import StudentProfile from '../models/StudentProfile.js';
import AcademicRecord from '../models/AcademicRecord.js';
import College from '../models/College.js';
import Course from '../models/Course.js';
import CollegeCourse from '../models/CollegeCourse.js';
import CollegePlacement from '../models/CollegePlacement.js';
import CollegeFee from '../models/CollegeFee.js';
import CampusFacility from '../models/CampusFacility.js';

function normalizeFacilityKey(pref) {
  if (!pref) return null;
  const p = String(pref).toLowerCase();
  if (p.includes('hostel')) return 'hostel';
  if (p.includes('library')) return 'library';
  if (p.includes('computer') || p.includes('computing') || p.includes('lab')) return 'computerLab';
  if (p.includes('wifi')) return 'wifi';
  if (p.includes('sport')) return 'sports';
  if (p.includes('gym')) return 'gym';
  if (p.includes('cafeteria') || p.includes('food')) return 'cafeteria';
  if (p.includes('transport') || p.includes('bus')) return 'transport';
  if (p.includes('medic') || p.includes('health')) return 'medicalFacility';
  if (p.includes('auditorium') || p.includes('seminar')) return 'auditorium';
  if (p.includes('placement')) return 'placementCell';
  if (p.includes('security') || p.includes('startup') || p.includes('incubation')) return 'campusSecurity';
  return null;
}

function academicScore(a) {
  if (!a) return 0;
  const tenth = Number(a.tenthPercentage) || 0;
  const twelfth = Number(a.twelfthPercentage) || 0;
  const ug = (a.ugPercentage !== null && a.ugPercentage !== undefined && a.ugPercentage !== '' && !isNaN(a.ugPercentage)) ? Number(a.ugPercentage) : null;
  if (ug === null) return +(tenth * 0.4 + twelfth * 0.6).toFixed(2);
  return +(tenth * 0.2 + twelfth * 0.4 + ug * 0.4).toFixed(2);
}

function budgetScore(budget, fee) {
  const numBudget = Number(budget) || 0;
  const numFee = Number(fee) || 0;
  if (numBudget <= 0 || numFee <= 0) return 50;
  if (numFee <= numBudget) return 100;
  return Math.max(0, +(100 - ((numFee - numBudget) / numBudget) * 100).toFixed(2));
}

function locationScore(pref, college) {
  if (!pref || pref === 'Any Location' || pref === 'Any') return 100;
  const p = String(pref).toLowerCase().trim();
  const city = String(college?.city || '').toLowerCase().trim();
  const state = String(college?.state || '').toLowerCase().trim();
  if (!p) return 100;
  if (p.includes(city) || (city && city.includes(p))) return 100;
  if (p.includes(state) || (state && state.includes(p))) return 70;
  return 30;
}

function facilityScore(preferred, facilities) {
  if (!preferred || !preferred.length || !facilities) return 100;
  let matches = 0;
  let validPrefs = 0;
  for (const item of preferred) {
    const key = normalizeFacilityKey(item);
    if (key) {
      validPrefs++;
      if (facilities[key] === true || facilities[key] === 1) {
        matches++;
      }
    }
  }
  if (validPrefs === 0) return 100;
  return +((matches / validPrefs) * 100).toFixed(2);
}

export async function calculateRecommendations(userId) {
  const [profile, academic] = await Promise.all([
    StudentProfile.findOne({ userId }).lean(),
    AcademicRecord.findOne({ studentId: userId }).lean()
  ]);

  if (!profile || !academic) {
    const e = new Error('Complete your profile and academic record first');
    e.status = 400;
    throw e;
  }

  const course = profile.preferredCourse ? await Course.findById(profile.preferredCourse).lean() : null;
  const [colleges, collegeCourses, placements, fees, facilities] = await Promise.all([
    College.find({ status: 'active' }).lean(),
    CollegeCourse.find({ status: 'active' }).lean(),
    CollegePlacement.find().lean(),
    CollegeFee.find().lean(),
    CampusFacility.find().lean()
  ]);

  const placementByCollege = new Map(placements.map((x) => [String(x.collegeId), x]));
  const facilityByCollege = new Map(facilities.map((x) => [String(x.collegeId), x]));
  const feeByCollegeCourse = new Map(fees.map((x) => [`${x.collegeId}:${x.courseId}`, x]));
  const academicSc = academicScore(academic);
  const results = [];

  for (const college of colleges) {
    const matches = collegeCourses.filter(
      (cc) => String(cc.collegeId) === String(college._id) && (!course || String(cc.courseId) === String(course._id))
    );
    if (course && matches.length === 0) continue;

    const match = matches[0];
    const fee = match ? feeByCollegeCourse.get(`${college._id}:${match.courseId}`) : fees.find((f) => String(f.collegeId) === String(college._id));
    const placement = placementByCollege.get(String(college._id));
    const facilitiesData = facilityByCollege.get(String(college._id));
    const courseMatch = course ? 100 : 75;
    const budgetSc = budgetScore(profile.budget, fee?.totalAnnualFee || 0);
    const placementSc = placement
      ? Math.min(100, +(placement.placementRate * 0.6 + Math.min(100, (placement.averagePackage / 1000000) * 100) * 0.4).toFixed(2))
      : 0;
    const facilitySc = facilityScore(profile.preferredFacilities, facilitiesData);
    const locSc = locationScore(profile.preferredLocation, college);
    const overall = +(academicSc * 0.3 + courseMatch * 0.2 + placementSc * 0.2 + budgetSc * 0.15 + facilitySc * 0.1 + locSc * 0.05).toFixed(2);

    const reasons = [];
    if (academicSc >= (college.eligibilityPercentage || 50)) {
      reasons.push('Your academic result meets the college eligibility threshold.');
    } else {
      reasons.push('Your academic score is below the listed eligibility threshold.');
    }
    if (course) reasons.push(`Offers your preferred ${course.courseName || 'engineering'} program.`);
    if (budgetSc >= 80) reasons.push('Tuition fee is within your target budget range.');
    if (placementSc >= 70) reasons.push('Strong campus placement track record with high median CTC.');
    if (facilitySc >= 70) reasons.push('Satisfies your key campus infrastructure preferences.');
    if (locSc >= 60) reasons.push('Matches your preferred geographic location in Gujarat.');

    results.push({
      college,
      courseMatch,
      academicScore: academicSc,
      budgetScore: budgetSc,
      placementScore: placementSc,
      facilityScore: facilitySc,
      locationScore: locSc,
      overallScore: overall,
      recommendationReason: reasons,
      fee,
      placement,
      facilities: facilitiesData,
      collegeCourse: match
    });
  }

  return results.sort((a, b) => b.overallScore - a.overallScore);
}
