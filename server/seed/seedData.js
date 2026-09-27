import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

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

async function seed() {
  console.log('Connecting to database...');
  await connectDB();

  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    AcademicRecord.deleteMany({}),
    College.deleteMany({}),
    Course.deleteMany({}),
    CollegeCourse.deleteMany({}),
    CollegePlacement.deleteMany({}),
    CollegeFee.deleteMany({}),
    CampusFacility.deleteMany({}),
    SavedCollege.deleteMany({}),
    Recommendation.deleteMany({})
  ]);

  // 1. ADMIN USER REQUESTED BY USER:
  // Admin: darshan@gmail.com, Password: darshan123
  console.log('Creating Admin users...');
  const darshanPass = await bcrypt.hash('darshan123', 12);
  const adminDarshan = await User.create({
    name: 'Darshan',
    email: 'darshan@gmail.com',
    password: darshanPass,
    role: 'admin',
    phone: '9825012345',
    status: 'active'
  });

  const defaultAdminPass = await bcrypt.hash('Admin@123', 12);
  await User.create({
    name: 'System Admin',
    email: 'admin@example.com',
    password: defaultAdminPass,
    role: 'admin',
    phone: '9876543210',
    status: 'active'
  });

  // 2. STUDENTS / USERS
  console.log('Creating Student Users...');
  const studentPassword = await bcrypt.hash('Student@123', 12);
  const studentsData = [
    { name: 'Aarav Patel', email: 'aarav.patel@gmail.com', phone: '9898011223' },
    { name: 'Diya Shah', email: 'diya.shah@gmail.com', phone: '9879022334' },
    { name: 'Rohan Sharma', email: 'rohan.sharma@gmail.com', phone: '9724033445' },
    { name: 'Priya Mehta', email: 'priya.mehta@gmail.com', phone: '9824044556' },
    { name: 'Ananya Joshi', email: 'ananya.joshi@gmail.com', phone: '9909055667' },
    { name: 'Kabir Verma', email: 'kabir.verma@gmail.com', phone: '9825066778' },
    { name: 'Demo Student', email: 'student@example.com', phone: '9876543210' }
  ];

  const createdStudents = await User.insertMany(
    studentsData.map(s => ({
      name: s.name,
      email: s.email,
      password: studentPassword,
      role: 'user',
      phone: s.phone,
      status: 'active'
    }))
  );

  // 3. COURSES & DEGREES
  console.log('Creating Courses & Degrees...');
  const courseList = [
    {
      courseName: 'B.Tech Computer Science and Engineering',
      courseCode: 'BTECH-CSE',
      level: 'UG',
      duration: '4 Years',
      description: 'Core computer science, algorithms, software engineering, systems programming, and modern development.',
      careerOptions: ['Software Engineer', 'Systems Architect', 'Cloud Developer', 'Full Stack Engineer'],
      status: 'active'
    },
    {
      courseName: 'B.Tech Information & Communication Technology',
      courseCode: 'BTECH-ICT',
      level: 'UG',
      duration: '4 Years',
      description: 'Blend of computing and communications engineering, embedded systems, and networks.',
      careerOptions: ['Network Engineer', 'Telecommunication Specialist', 'IoT Engineer', 'Software Developer'],
      status: 'active'
    },
    {
      courseName: 'B.Tech Artificial Intelligence & Data Science',
      courseCode: 'BTECH-AIDS',
      level: 'UG',
      duration: '4 Years',
      description: 'Machine learning, deep learning, NLP, computer vision, big data frameworks, and neural networks.',
      careerOptions: ['AI Engineer', 'Data Scientist', 'ML Researcher', 'Data Analyst'],
      status: 'active'
    },
    {
      courseName: 'B.Tech Electronics & Communication Engineering',
      courseCode: 'BTECH-ECE',
      level: 'UG',
      duration: '4 Years',
      description: 'VLSI design, digital signal processing, robotics, microprocessors, and circuit engineering.',
      careerOptions: ['VLSI Engineer', 'Robotics Engineer', 'Hardware Specialist', 'Embedded Developer'],
      status: 'active'
    },
    {
      courseName: 'Bachelor of Computer Applications (BCA)',
      courseCode: 'BCA',
      level: 'UG',
      duration: '3 Years',
      description: 'Web development, database management, app programming, and business software tools.',
      careerOptions: ['Web Developer', 'Database Admin', 'App Developer', 'IT Consultant'],
      status: 'active'
    },
    {
      courseName: 'Master of Computer Applications (MCA)',
      courseCode: 'MCA',
      level: 'PG',
      duration: '2 Years',
      description: 'Advanced computing, cloud computing, enterprise architectures, and distributed systems.',
      careerOptions: ['Enterprise Architect', 'Senior Software Engineer', 'Product Tech Lead'],
      status: 'active'
    },
    {
      courseName: 'Master of Business Administration (MBA)',
      courseCode: 'MBA',
      level: 'PG',
      duration: '2 Years',
      description: 'Finance, marketing, business analytics, operations, strategic leadership, and management.',
      careerOptions: ['Product Manager', 'Management Consultant', 'Financial Analyst', 'Marketing Director'],
      status: 'active'
    },
    {
      courseName: 'B.Sc Data Science & Analytics',
      courseCode: 'BSC-DS',
      level: 'UG',
      duration: '3 Years',
      description: 'Applied mathematics, statistical modeling, machine learning algorithms, and visualization.',
      careerOptions: ['Business Intelligence Analyst', 'Data Engineer', 'Statistical Modeler'],
      status: 'active'
    },
    {
      courseName: 'B.Sc Cyber Security & Digital Forensics',
      courseCode: 'BSC-CS',
      level: 'UG',
      duration: '3 Years',
      description: 'Network defense, ethical hacking, cyber forensics, incident response, and cryptography.',
      careerOptions: ['Security Analyst', 'Ethical Hacker', 'Forensics Investigator', 'SOC Analyst'],
      status: 'active'
    },
    {
      courseName: 'Bachelor of Business Administration (BBA)',
      courseCode: 'BBA',
      level: 'UG',
      duration: '3 Years',
      description: 'Foundations of commerce, corporate law, financial planning, marketing, and entrepreneurship.',
      careerOptions: ['Business Analyst', 'HR Specialist', 'Operations Executive', 'Startup Founder'],
      status: 'active'
    }
  ];

  const createdCourses = await Course.insertMany(courseList);

  // 4. COLLEGES & UNIVERSITIES
  console.log('Creating Colleges & Universities...');
  const collegesData = [
    {
      name: 'Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)',
      university: 'DA-IICT University',
      description: 'Premier ICT institute renowned for exceptional computer science research, innovation, and top placements.',
      city: 'Gandhinagar',
      state: 'Gujarat',
      address: 'Near Indroda Circle, Gandhinagar',
      collegeType: 'Private',
      establishedYear: 2001,
      website: 'https://www.daiict.ac.in',
      email: 'admissions@daiict.ac.in',
      phone: '07969080808',
      campusSize: '50 acres',
      collegeRating: 4.8,
      eligibilityPercentage: 75,
      status: 'active'
    },
    {
      name: 'Nirma University - Institute of Technology',
      university: 'Nirma University',
      description: 'Leading autonomous university recognized for technical excellence, world-class labs, and industry tie-ups.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: 'Sarkhej-Gandhinagar Highway, Gota, Ahmedabad',
      collegeType: 'Private',
      establishedYear: 1995,
      website: 'https://technology.nirmauni.ac.in',
      email: 'admissions.it@nirmauni.ac.in',
      phone: '07971652000',
      campusSize: '115 acres',
      collegeRating: 4.6,
      eligibilityPercentage: 70,
      status: 'active'
    },
    {
      name: 'L.D. College of Engineering (LDCE)',
      university: 'Gujarat Technological University (GTU)',
      description: 'Historic apex government engineering college established in 1948 with rich alumni heritage and high ROI.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: '120 Circular Road, University Area, Navrangpura, Ahmedabad',
      collegeType: 'Government',
      establishedYear: 1948,
      website: 'https://ldce.ac.in',
      email: 'principal@ldce.ac.in',
      phone: '07926306752',
      campusSize: '45 acres',
      collegeRating: 4.5,
      eligibilityPercentage: 65,
      status: 'active'
    },
    {
      name: 'Pandit Deendayal Energy University (PDEU)',
      university: 'PDEU',
      description: 'World-class energy, engineering, and liberal studies university with cutting-edge infrastructure and research parks.',
      city: 'Gandhinagar',
      state: 'Gujarat',
      address: 'Knowledge Corridor, Raisan Village, Gandhinagar',
      collegeType: 'Deemed',
      establishedYear: 2007,
      website: 'https://www.pdeu.ac.in',
      email: 'admissions@pdeu.ac.in',
      phone: '07923275060',
      campusSize: '100 acres',
      collegeRating: 4.6,
      eligibilityPercentage: 65,
      status: 'active'
    },
    {
      name: 'Sardar Vallabhbhai National Institute of Technology (SVNIT)',
      university: 'Institute of National Importance (NIT)',
      description: 'Prestigious National Institute of Technology known for high-caliber engineering, research, and global placements.',
      city: 'Surat',
      state: 'Gujarat',
      address: 'Ichchhanath, Dumas Road, Surat',
      collegeType: 'Government',
      establishedYear: 1961,
      website: 'https://www.svnit.ac.in',
      email: 'dean_acad@svnit.ac.in',
      phone: '02612259571',
      campusSize: '250 acres',
      collegeRating: 4.7,
      eligibilityPercentage: 75,
      status: 'active'
    },
    {
      name: 'Maharaja Sayajirao University of Baroda (MSU)',
      university: 'MS University of Baroda',
      description: 'One of Western India’s oldest, most esteemed multi-disciplinary universities with lush historic campus.',
      city: 'Vadodara',
      state: 'Gujarat',
      address: 'Pratapgunj, Vadodara',
      collegeType: 'Government',
      establishedYear: 1949,
      website: 'https://www.msubaroda.ac.in',
      email: 'info@msubaroda.ac.in',
      phone: '02652795555',
      campusSize: '275 acres',
      collegeRating: 4.4,
      eligibilityPercentage: 60,
      status: 'active'
    },
    {
      name: 'Ahmedabad University - School of Engineering',
      university: 'Ahmedabad University',
      description: 'Interdisciplinary, research-driven liberal education institute fostering entrepreneurial and tech mindsets.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: 'Commerce Six Roads, Navrangpura, Ahmedabad',
      collegeType: 'Private',
      establishedYear: 2009,
      website: 'https://ahduni.edu.in',
      email: 'admissions@ahduni.edu.in',
      phone: '07961911000',
      campusSize: '60 acres',
      collegeRating: 4.5,
      eligibilityPercentage: 65,
      status: 'active'
    },
    {
      name: 'Birla Vishvakarma Mahavidyalaya (BVM)',
      university: 'CVM University',
      description: 'Gujarat’s premier engineering institution, founded by Sardar Patel, noted for rigorous academic standards.',
      city: 'Anand',
      state: 'Gujarat',
      address: 'Vallabh Vidyanagar, Anand',
      collegeType: 'Autonomous',
      establishedYear: 1948,
      website: 'https://www.bvmengineering.ac.in',
      email: 'principal@bvmengineering.ac.in',
      phone: '02692230104',
      campusSize: '40 acres',
      collegeRating: 4.3,
      eligibilityPercentage: 60,
      status: 'active'
    },
    {
      name: 'Charotar University of Science and Technology (CHARUSAT)',
      university: 'CHARUSAT University',
      description: 'Accredited Grade A+ university with modern sprawling campus, specialized healthcare and computing labs.',
      city: 'Changa',
      state: 'Gujarat',
      address: 'CHARUSAT Campus, Changa, Anand',
      collegeType: 'Private',
      establishedYear: 2000,
      website: 'https://www.charusat.ac.in',
      email: 'admission@charusat.ac.in',
      phone: '02697265011',
      campusSize: '120 acres',
      collegeRating: 4.3,
      eligibilityPercentage: 55,
      status: 'active'
    },
    {
      name: 'Dharmsinh Desai University (DDU)',
      university: 'DDU',
      description: 'Renowned autonomous technological university with unmatched alumni presence in Silicon Valley and Fortune 500s.',
      city: 'Nadiad',
      state: 'Gujarat',
      address: 'College Road, Nadiad',
      collegeType: 'Autonomous',
      establishedYear: 1968,
      website: 'https://www.ddu.ac.in',
      email: 'registrar@ddu.ac.in',
      phone: '02682520502',
      campusSize: '42 acres',
      collegeRating: 4.4,
      eligibilityPercentage: 65,
      status: 'active'
    },
    {
      name: 'Marwadi University',
      university: 'Marwadi University',
      description: 'Dynamic NAAC A+ accredited university with comprehensive placement training and international student body.',
      city: 'Rajkot',
      state: 'Gujarat',
      address: 'Rajkot-Morbi Highway, Gauridad, Rajkot',
      collegeType: 'Private',
      establishedYear: 2008,
      website: 'https://www.marwadiuniversity.ac.in',
      email: 'info@marwadiuniversity.ac.in',
      phone: '02817123456',
      campusSize: '52 acres',
      collegeRating: 4.1,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Silver Oak University',
      university: 'Silver Oak University',
      description: 'Prominent educational hub in central Ahmedabad focusing on industry-ready IT and engineering diplomas and degrees.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: 'Opp. Bhagwat Vidyapith, S.G. Highway, Gota, Ahmedabad',
      collegeType: 'Private',
      establishedYear: 2009,
      website: 'https://silveroakuni.ac.in',
      email: 'admission@silveroakuni.ac.in',
      phone: '07966046300',
      campusSize: '30 acres',
      collegeRating: 4.0,
      eligibilityPercentage: 50,
      status: 'active'
    }
  ];

  const createdColleges = await College.insertMany(collegesData);

  // 5. COLLEGE COURSES MAPPING
  console.log('Mapping College Courses...');
  const ccRecords = [];
  createdColleges.forEach((col, cIdx) => {
    // Each college offers 4-6 courses
    const numCourses = 5;
    for (let i = 0; i < numCourses; i++) {
      const course = createdCourses[(cIdx + i) % createdCourses.length];
      ccRecords.push({
        collegeId: col._id,
        courseId: course._id,
        eligibilityPercentage: col.eligibilityPercentage,
        availableSeats: 60 + (i % 3) * 60,
        admissionType: cIdx % 2 === 0 ? 'Merit' : 'Entrance',
        entranceRequired: cIdx % 2 !== 0,
        status: 'active'
      });
    }
  });
  await CollegeCourse.insertMany(ccRecords);

  // 6. PLACEMENTS & CTC RECORDS
  console.log('Creating Placements & CTC Records...');
  const placementData = [
    { colName: 'DA-IICT', rate: 96, avg: 1650000, high: 5200000, low: 800000, companies: 140 },
    { colName: 'Nirma University', rate: 90, avg: 1050000, high: 3800000, low: 550000, companies: 180 },
    { colName: 'LDCE', rate: 86, avg: 780000, high: 2400000, low: 450000, companies: 125 },
    { colName: 'PDEU', rate: 88, avg: 920000, high: 3200000, low: 500000, companies: 135 },
    { colName: 'SVNIT', rate: 93, avg: 1480000, high: 4800000, low: 750000, companies: 165 },
    { colName: 'MSU', rate: 82, avg: 680000, high: 2100000, low: 400000, companies: 95 },
    { colName: 'Ahmedabad University', rate: 87, avg: 850000, high: 2800000, low: 500000, companies: 90 },
    { colName: 'BVM', rate: 81, avg: 650000, high: 1800000, low: 400000, companies: 85 },
    { colName: 'CHARUSAT', rate: 83, avg: 620000, high: 2000000, low: 380000, companies: 80 },
    { colName: 'DDU', rate: 85, avg: 720000, high: 2200000, low: 420000, companies: 90 },
    { colName: 'Marwadi University', rate: 76, avg: 550000, high: 1600000, low: 350000, companies: 75 },
    { colName: 'Silver Oak University', rate: 73, avg: 480000, high: 1500000, low: 320000, companies: 65 }
  ];

  const placementRecords = createdColleges.map((col, idx) => {
    const p = placementData[idx] || { rate: 80, avg: 600000, high: 2000000, low: 400000, companies: 80 };
    return {
      collegeId: col._id,
      placementRate: p.rate,
      averagePackage: p.avg,
      highestPackage: p.high,
      lowestPackage: p.low,
      companiesVisited: p.companies,
      placementYear: 2026
    };
  });
  await CollegePlacement.insertMany(placementRecords);

  // 7. COLLEGE FEES
  console.log('Creating College Fee structures...');
  const feeRecords = [];
  createdColleges.forEach((col, idx) => {
    const isGovt = col.collegeType === 'Government';
    const isAutonomous = col.collegeType === 'Autonomous';
    const tuition = isGovt ? 6000 : isAutonomous ? 85000 : 180000 + (idx % 4) * 25000;
    const hostel = isGovt ? 8000 : 45000 + (idx % 3) * 10000;
    const other = 10000;
    const course = createdCourses[idx % createdCourses.length];

    feeRecords.push({
      collegeId: col._id,
      courseId: course._id,
      annualTuitionFee: tuition,
      hostelFee: hostel,
      otherFees: other,
      totalAnnualFee: tuition + hostel + other,
      scholarshipAvailable: true,
      scholarshipDetails: isGovt
        ? 'Government MYSY and SC/ST full fee waiver'
        : 'Merit scholarship up to 50% for entrance exam top percentiles'
    });
  });
  await CollegeFee.insertMany(feeRecords);

  // 8. CAMPUS FACILITIES
  console.log('Creating Campus Facilities records...');
  const facilityRecords = createdColleges.map((col, idx) => ({
    collegeId: col._id,
    hostel: true,
    library: true,
    computerLab: true,
    wifi: true,
    sports: true,
    gym: idx % 3 !== 0,
    cafeteria: true,
    transport: true,
    medicalFacility: idx % 2 === 0,
    auditorium: true,
    placementCell: true,
    campusSecurity: true
  }));
  await CampusFacility.insertMany(facilityRecords);

  // 9. STUDENT PROFILES & ACADEMIC RECORDS
  console.log('Creating Student Profiles & Academic Records...');
  const profiles = [];
  const academics = [];

  createdStudents.forEach((student, idx) => {
    const goals = [
      'Full Stack Software Engineer & Cloud Architect',
      'Artificial Intelligence Specialist and Research Engineer',
      'Data Scientist in FinTech & Global Analytics',
      'Cybersecurity Specialist & Ethical Threat Hunter',
      'Mobile Application Developer & Entrepreneur',
      'Robotics & Embedded Systems Hardware Engineer',
      'Corporate Strategy & Technology Consultant'
    ];

    const preferredLocations = ['Gandhinagar', 'Ahmedabad', 'Surat', 'Vadodara', 'Any Location'];
    const preferredCourses = createdCourses[idx % createdCourses.length]._id;

    profiles.push({
      userId: student._id,
      dateOfBirth: new Date(2004, idx % 12, 10 + idx),
      gender: idx % 2 === 0 ? 'Male' : 'Female',
      city: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'][idx % 5],
      state: 'Gujarat',
      preferredLocation: preferredLocations[idx % preferredLocations.length],
      careerGoal: goals[idx % goals.length],
      preferredCourse: preferredCourses,
      budget: 200000 + (idx % 4) * 150000,
      preferredCollegeType: ['Private', 'Government', 'Autonomous', 'Deemed'][idx % 4],
      preferredFacilities: ['hostel', 'wifi', 'library', 'placementCell', 'computerLab']
    });

    academics.push({
      studentId: student._id,
      tenthPercentage: 84 + (idx % 10),
      twelfthPercentage: 82 + (idx % 12),
      ugPercentage: null,
      entranceExam: idx % 2 === 0 ? 'JEE Main' : 'GUJCET',
      entranceScore: 88 + (idx % 10) * 1.2,
      passingYear: 2025
    });
  });

  await StudentProfile.insertMany(profiles);
  await AcademicRecord.insertMany(academics);

  // 10. SAVED COLLEGES
  console.log('Creating Saved Colleges...');
  const savedRecords = [];
  createdStudents.forEach((student, sIdx) => {
    // Bookmark 2-3 colleges per student
    const fav1 = createdColleges[sIdx % createdColleges.length]._id;
    const fav2 = createdColleges[(sIdx + 3) % createdColleges.length]._id;
    savedRecords.push({ studentId: student._id, collegeId: fav1 });
    savedRecords.push({ studentId: student._id, collegeId: fav2 });
  });
  await SavedCollege.insertMany(savedRecords);

  // 11. AI RECOMMENDATION LOGS
  console.log('Generating AI Recommendation Logs...');
  const recommendationLogs = [];

  createdStudents.forEach((student, sIdx) => {
    // 3 recommendations per student with detailed weighted scores
    for (let r = 0; r < 3; r++) {
      const college = createdColleges[(sIdx + r * 2) % createdColleges.length];
      const acadScore = Math.min(98, 82 + (sIdx * 3 + r * 4) % 16);
      const courseScore = Math.min(99, 88 + (sIdx * 2 + r * 3) % 11);
      const budgetScore = Math.min(96, 78 + (sIdx * 4 + r * 5) % 18);
      const placementScore = Math.min(97, 85 + (sIdx * 3 + r * 2) % 12);
      const facilityScore = 90 + (sIdx + r) % 8;
      const locationScore = 84 + (sIdx * 2 + r) % 14;

      const overall = Math.round(
        acadScore * 0.25 +
        courseScore * 0.20 +
        budgetScore * 0.15 +
        placementScore * 0.25 +
        facilityScore * 0.08 +
        locationScore * 0.07
      );

      const reasons = [
        `High placement track record with ${college.name.split('-')[0].trim()}`,
        `Course curriculum aligned with career goal: ${profiles[sIdx].careerGoal.split('&')[0].trim()}`,
        `Located in preferred region: ${college.city}`,
        `College accreditation rating is ${college.collegeRating} / 5.0`
      ];

      recommendationLogs.push({
        studentId: student._id,
        collegeId: college._id,
        academicScore: acadScore,
        courseMatchScore: courseScore,
        budgetScore: budgetScore,
        placementScore: placementScore,
        facilityScore: facilityScore,
        locationScore: locationScore,
        overallScore: overall,
        recommendationReason: reasons
      });
    }
  });

  await Recommendation.insertMany(recommendationLogs);

  console.log('\n========================================');
  console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('========================================');
  console.log('Admin Account (Requested):');
  console.log('  Email:    darshan@gmail.com');
  console.log('  Password: darshan123');
  console.log('  Role:     admin');
  console.log('----------------------------------------');
  console.log('Default Admin Account:');
  console.log('  Email:    admin@example.com');
  console.log('  Password: Admin@123');
  console.log('----------------------------------------');
  console.log('Demo Student Account:');
  console.log('  Email:    student@example.com');
  console.log('  Password: Student@123');
  console.log('----------------------------------------');
  console.log('Total Counts Seeded:');
  console.log(`  Users:               ${await User.countDocuments()}`);
  console.log(`  Student Profiles:    ${await StudentProfile.countDocuments()}`);
  console.log(`  Academic Records:    ${await AcademicRecord.countDocuments()}`);
  console.log(`  Colleges:            ${await College.countDocuments()}`);
  console.log(`  Courses:             ${await Course.countDocuments()}`);
  console.log(`  College Courses:     ${await CollegeCourse.countDocuments()}`);
  console.log(`  College Placements:  ${await CollegePlacement.countDocuments()}`);
  console.log(`  College Fees:        ${await CollegeFee.countDocuments()}`);
  console.log(`  Campus Facilities:   ${await CampusFacility.countDocuments()}`);
  console.log(`  Saved Colleges:      ${await SavedCollege.countDocuments()}`);
  console.log(`  Recommendations:     ${await Recommendation.countDocuments()}`);
  console.log('========================================\n');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
