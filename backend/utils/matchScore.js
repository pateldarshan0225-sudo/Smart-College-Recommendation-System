// Score: percentage margin / 30 (capped) * 30; remaining budget / budget * 25;
// rating / 5 * 20; preferred state match (or no preference) 15; course match (or no preference) 10.
// Eligibility is checked separately; this score ranks eligible offerings, not admission probability.
export default function matchScore(profile, offering) {
  const marks = Math.min(30, Math.max(0, profile.percentage - offering.minPercentage));
  const budget = profile.budget === 0 ? 25 : Math.max(0, (profile.budget - offering.fees) / profile.budget) * 25;
  const state = !profile.preferredState || profile.preferredState.toLowerCase() === offering.collegeId.state.toLowerCase() ? 15 : 0;
  const course = !profile.preferredCourse || String(profile.preferredCourse) === String(offering.courseId._id) ? 10 : 0;
  return Math.round((marks + budget + offering.collegeId.rating / 5 * 20 + state + course) * 100) / 100;
}

// Keep eligibility separate from ranking so every mandatory rule is explicit.
export function isEligible(profile, offering) {
  if (!offering.collegeId || !offering.courseId) return false;
  if (offering.isActive === false || offering.collegeId.isActive === false || offering.courseId.isActive === false) return false;
  if (profile.percentage < offering.minPercentage || offering.fees > profile.budget) return false;
  if (profile.preferredState && profile.preferredState.toLowerCase() !== offering.collegeId.state.toLowerCase()) return false;
  if (profile.preferredCourse && String(profile.preferredCourse) !== String(offering.courseId._id)) return false;
  if (offering.entranceExamId && (String(profile.entranceExam) !== String(offering.entranceExamId) || profile.entranceScore < offering.cutoffScore)) return false;
  return true;
}
