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
      collegeRating: 4.9,
      eligibilityPercentage: 75,
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
      collegeRating: 4.7,
      eligibilityPercentage: 70,
      status: 'active'
    },
    {
      name: 'Indian Institute of Technology Gandhinagar (IITGN)',
      university: 'IIT Council',
      description: 'Premier Indian Institute of Technology fostering interdisciplinary innovation and stellar global placements.',
      city: 'Gandhinagar',
      state: 'Gujarat',
      address: 'Palaj, Gandhinagar',
      collegeType: 'Government',
      establishedYear: 2008,
      website: 'https://iitgn.ac.in',
      email: 'admissions@iitgn.ac.in',
      phone: '07923952000',
      campusSize: '400 acres',
      collegeRating: 4.9,
      eligibilityPercentage: 80,
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
      collegeRating: 4.4,
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
      collegeRating: 4.5,
      eligibilityPercentage: 55,
      status: 'active'
    },
    {
      name: 'Vishwakarma Government Engineering College (VGEC)',
      university: 'Gujarat Technological University (GTU)',
      description: 'Premier government engineering college in Chandkheda Ahmedabad delivering quality subsidized education.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: 'Opp. Sangath Mall, Chandkheda, Ahmedabad',
      collegeType: 'Government',
      establishedYear: 1999,
      website: 'https://vgecg.ac.in',
      email: 'principal@vgecg.ac.in',
      phone: '07923293866',
      campusSize: '35 acres',
      collegeRating: 4.3,
      eligibilityPercentage: 60,
      status: 'active'
    },
    {
      name: 'Indian Institute of Information Technology Surat (IIIT Surat)',
      university: 'IIIT Council',
      description: 'Institute of National Importance specializing in Computer Science, Data Engineering, and Microelectronics.',
      city: 'Surat',
      state: 'Gujarat',
      address: 'Kholvad Campus, Kamrej, Surat',
      collegeType: 'Government',
      establishedYear: 2017,
      website: 'https://iiitsurat.ac.in',
      email: 'office@iiitsurat.ac.in',
      phone: '02612729000',
      campusSize: '50 acres',
      collegeRating: 4.6,
      eligibilityPercentage: 70,
      status: 'active'
    },
    {
      name: 'Indian Institute of Information Technology Vadodara (IIITV)',
      university: 'IIIT Council',
      description: 'Premier central IIIT providing world-class CS and software engineering curriculum with top multinational hiring.',
      city: 'Gandhinagar',
      state: 'Gujarat',
      address: 'Block 9, GEC Gandhinagar Campus, Sector 28',
      collegeType: 'Government',
      establishedYear: 2013,
      website: 'https://iiitvadodara.ac.in',
      email: 'administration@iiitvadodara.ac.in',
      phone: '07923977503',
      campusSize: '50 acres',
      collegeRating: 4.6,
      eligibilityPercentage: 70,
      status: 'active'
    },
    {
      name: 'Adani University - Faculty of Engineering Sciences',
      university: 'Adani University',
      description: 'Focused on energy, smart mobility, AI, and smart infrastructure engineering with direct industry placement tracks.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: 'Shantigram Township, SG Highway, Ahmedabad',
      collegeType: 'Private',
      establishedYear: 2014,
      website: 'https://adaniuni.ac.in',
      email: 'admissions@adaniuni.ac.in',
      phone: '07925556592',
      campusSize: '40 acres',
      collegeRating: 4.4,
      eligibilityPercentage: 60,
      status: 'active'
    },
    {
      name: 'G H Patel College of Engineering & Technology (GCET)',
      university: 'CVM University',
      description: 'Premier autonomous technical college in Vallabh Vidyanagar known for engineering rigor and active labs.',
      city: 'Anand',
      state: 'Gujarat',
      address: 'Bakrol Road, Vallabh Vidyanagar, Anand',
      collegeType: 'Autonomous',
      establishedYear: 1996,
      website: 'https://gcet.ac.in',
      email: 'principal@gcet.ac.in',
      phone: '02692231651',
      campusSize: '30 acres',
      collegeRating: 4.3,
      eligibilityPercentage: 55,
      status: 'active'
    },
    {
      name: 'Indus University - Institute of Technology & Engineering',
      university: 'Indus University',
      description: 'Sprawling green campus near Thaltej Ahmedabad offering specialized degrees in CS, AI, mechanical, and avionics.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: 'Rancharda, Via Thaltej, Ahmedabad',
      collegeType: 'Private',
      establishedYear: 2006,
      website: 'https://indusuni.ac.in',
      email: 'admission@indusuni.ac.in',
      phone: '02764260277',
      campusSize: '35 acres',
      collegeRating: 4.2,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Parul Institute of Engineering & Technology (PIET)',
      university: 'Parul University',
      description: 'NAAC A++ multi-disciplinary university hosting 40,000+ students from 60+ countries and extensive placement records.',
      city: 'Vadodara',
      state: 'Gujarat',
      address: 'P.O. Limda, Ta. Waghodia, Vadodara',
      collegeType: 'Private',
      establishedYear: 2003,
      website: 'https://paruluniversity.ac.in',
      email: 'admissions@paruluniversity.ac.in',
      phone: '02668260300',
      campusSize: '150 acres',
      collegeRating: 4.4,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Government Engineering College Gandhinagar (GECG)',
      university: 'Gujarat Technological University (GTU)',
      description: 'High-ranking state government engineering college known for biomedical, IT, EC, and computer branches.',
      city: 'Gandhinagar',
      state: 'Gujarat',
      address: 'Sector 28, Gandhinagar',
      collegeType: 'Government',
      establishedYear: 2004,
      website: 'https://gecg.ac.in',
      email: 'gec-gnagar-dte@gujarat.gov.in',
      phone: '07923215167',
      campusSize: '33 acres',
      collegeRating: 4.2,
      eligibilityPercentage: 55,
      status: 'active'
    },
    {
      name: 'Government Engineering College Rajkot (GECR)',
      university: 'Gujarat Technological University (GTU)',
      description: 'Apex government engineering college in Saurashtra region with active incubation center and industry linkage.',
      city: 'Rajkot',
      state: 'Gujarat',
      address: 'Mavdi-Kankot Road, Rajkot',
      collegeType: 'Government',
      establishedYear: 2004,
      website: 'https://gecrajkot.ac.in',
      email: 'gec-rajkot-dte@gujarat.gov.in',
      phone: '02812924161',
      campusSize: '40 acres',
      collegeRating: 4.2,
      eligibilityPercentage: 55,
      status: 'active'
    },
    {
      name: 'Government Engineering College Bhavnagar',
      university: 'Gujarat Technological University (GTU)',
      description: 'Government engineering college providing core branch excellence with dedicated state placement support.',
      city: 'Bhavnagar',
      state: 'Gujarat',
      address: 'Vidhyanagar, Bhavnagar',
      collegeType: 'Government',
      establishedYear: 2004,
      website: 'https://gecbhavnagar.ac.in',
      email: 'gec-bhav-dte@gujarat.gov.in',
      phone: '02782525698',
      campusSize: '30 acres',
      collegeRating: 4.1,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Government Engineering College Modasa (GECM)',
      university: 'Gujarat Technological University (GTU)',
      description: 'Established state institution catering to Aravalli and North Gujarat technical aspirants with top labs.',
      city: 'Modasa',
      state: 'Gujarat',
      address: 'Shamlaji Road, Modasa',
      collegeType: 'Government',
      establishedYear: 1984,
      website: 'https://gecmodasa.ac.in',
      email: 'gec-modasa-dte@gujarat.gov.in',
      phone: '02774242633',
      campusSize: '54 acres',
      collegeRating: 4.1,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Sarvajanik College of Engineering & Technology (SCET)',
      university: 'Sarvajanik University',
      description: 'Surat city center premier autonomous engineering college with high textile, chemical, and software hiring.',
      city: 'Surat',
      state: 'Gujarat',
      address: 'Dr. R.K. Desai Marg, Athwalines, Surat',
      collegeType: 'Autonomous',
      establishedYear: 1995,
      website: 'https://scet.ac.in',
      email: 'principal@scet.ac.in',
      phone: '02612240146',
      campusSize: '25 acres',
      collegeRating: 4.3,
      eligibilityPercentage: 55,
      status: 'active'
    },
    {
      name: 'Government Engineering College Surat',
      university: 'Gujarat Technological University (GTU)',
      description: 'Key government engineering college delivering high return on education in Surat industrial corridor.',
      city: 'Surat',
      state: 'Gujarat',
      address: 'Dr. S.&S.S. Ghandhy College Campus, Majura Gate, Surat',
      collegeType: 'Government',
      establishedYear: 2004,
      website: 'https://gecsurat.ac.in',
      email: 'gec-surat-dte@gujarat.gov.in',
      phone: '02612655799',
      campusSize: '28 acres',
      collegeRating: 4.1,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Government Engineering College Valsad',
      university: 'Gujarat Technological University (GTU)',
      description: 'State government institution situated in Valsad close to Vapi and Hazira industrial zones.',
      city: 'Valsad',
      state: 'Gujarat',
      address: 'Between BKM Science College and Government Polytechnic, Valsad',
      collegeType: 'Government',
      establishedYear: 2004,
      website: 'https://gecvalsad.ac.in',
      email: 'gec-valsad-dte@gujarat.gov.in',
      phone: '02632241960',
      campusSize: '32 acres',
      collegeRating: 4.0,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Government Engineering College Patan',
      university: 'Gujarat Technological University (GTU)',
      description: 'Established state engineering college serving North Gujarat students with updated computer and core labs.',
      city: 'Patan',
      state: 'Gujarat',
      address: 'At. Katpur, Ta. Patan',
      collegeType: 'Government',
      establishedYear: 2004,
      website: 'https://gecpatan.ac.in',
      email: 'gec-patan-dte@gujarat.gov.in',
      phone: '02766291560',
      campusSize: '45 acres',
      collegeRating: 4.0,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Government Engineering College Dahod',
      university: 'Gujarat Technological University (GTU)',
      description: 'Government engineering campus providing engineering degrees with full scholarship and hostel backing.',
      city: 'Dahod',
      state: 'Gujarat',
      address: 'Zalod Road, Dahod',
      collegeType: 'Government',
      establishedYear: 2004,
      website: 'https://gecdahod.ac.in',
      email: 'gec-dahod-dte@gujarat.gov.in',
      phone: '02673299111',
      campusSize: '38 acres',
      collegeRating: 3.9,
      eligibilityPercentage: 45,
      status: 'active'
    },
    {
      name: 'Government Engineering College Bharuch',
      university: 'Gujarat Technological University (GTU)',
      description: 'Strategic government institute located close to Dahej and Ankleshwar industrial chemical clusters.',
      city: 'Bharuch',
      state: 'Gujarat',
      address: 'Old National Highway No. 8, Bholav, Bharuch',
      collegeType: 'Government',
      establishedYear: 2004,
      website: 'https://gecbharuch.ac.in',
      email: 'gec-bharuch-dte@gujarat.gov.in',
      phone: '02642246402',
      campusSize: '30 acres',
      collegeRating: 4.0,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Government Engineering College Godhra',
      university: 'Gujarat Technological University (GTU)',
      description: 'State government campus supporting eastern Gujarat engineering education with robust laboratory setups.',
      city: 'Godhra',
      state: 'Gujarat',
      address: 'Chhabanpur, Godhra',
      collegeType: 'Government',
      establishedYear: 2004,
      website: 'https://gecgodhra.ac.in',
      email: 'gec-godhra-dte@gujarat.gov.in',
      phone: '02672265266',
      campusSize: '35 acres',
      collegeRating: 3.9,
      eligibilityPercentage: 45,
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
      collegeRating: 4.2,
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
      collegeRating: 4.1,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Lukhdhirji Engineering College (LEC Morbi)',
      university: 'Gujarat Technological University (GTU)',
      description: 'One of the oldest polytechnic and engineering colleges in Gujarat, located on the banks of Machchhu river in Morbi.',
      city: 'Morbi',
      state: 'Gujarat',
      address: 'Nazarbagh, Morbi',
      collegeType: 'Government',
      establishedYear: 1931,
      website: 'https://lecmorbi.ac.in',
      email: 'lec-morbi-dte@gujarat.gov.in',
      phone: '02822240445',
      campusSize: '40 acres',
      collegeRating: 4.1,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Shantilal Shah Engineering College (SSEC)',
      university: 'Gujarat Technological University (GTU)',
      description: 'Sprawling government engineering institute with strong departments in IT, Civil, Marine, and Electronics.',
      city: 'Bhavnagar',
      state: 'Gujarat',
      address: 'Post Sidsar, Via Vartej, Bhavnagar',
      collegeType: 'Government',
      establishedYear: 1983,
      website: 'https://ssgec.ac.in',
      email: 'ssec-bhav-dte@gujarat.gov.in',
      phone: '02782804200',
      campusSize: '80 acres',
      collegeRating: 4.0,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'L.J. Institute of Engineering & Technology (LJIET)',
      university: 'Lok Jagruti University (LJU)',
      description: 'Major Ahmedabad technology campus known for practical coding bootcamps and strong corporate internships.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: 'Near Sarkhej-Sanand Circle, S.G. Road, Ahmedabad',
      collegeType: 'Private',
      establishedYear: 2007,
      website: 'https://ljiet.ac.in',
      email: 'info@ljiet.ac.in',
      phone: '07926890383',
      campusSize: '45 acres',
      collegeRating: 4.2,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'SAL Institute of Technology & Engineering Research',
      university: 'Gujarat Technological University (GTU)',
      description: 'Popular technical campus near Science City offering undergraduate engineering and computing degrees.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: 'Opp. Science City, Sola-Bhadaj Road, Ahmedabad',
      collegeType: 'Private',
      establishedYear: 2009,
      website: 'https://sal.edu.in',
      email: 'saliter@sal.edu.in',
      phone: '07967123456',
      campusSize: '25 acres',
      collegeRating: 4.0,
      eligibilityPercentage: 48,
      status: 'active'
    },
    {
      name: 'Ganpat University - U.V. Patel College of Engineering',
      university: 'Ganpat University',
      description: 'Renowned high-tech private university campus in Kherva Mehsana offering specialized industrial engineering tracks.',
      city: 'Mehsana',
      state: 'Gujarat',
      address: 'Ganpat Vidyanagar, Mehsana-Gozaria Highway, Kherva',
      collegeType: 'Private',
      establishedYear: 1997,
      website: 'https://ganpatuniversity.ac.in',
      email: 'info@ganpatuniversity.ac.in',
      phone: '02762286805',
      campusSize: '300 acres',
      collegeRating: 4.2,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Sankalchand Patel College of Engineering (SPCE)',
      university: 'Sankalchand Patel University',
      description: 'Established technical institution in Visnagar with extensive modern sports, hostel, and engineering labs.',
      city: 'Visnagar',
      state: 'Gujarat',
      address: 'Sankalchand Patel Vidyadham, Ambaji-Gandhinagar Link Road, Visnagar',
      collegeType: 'Private',
      establishedYear: 1999,
      website: 'https://spu.ac.in',
      email: 'principal.spce@spu.ac.in',
      phone: '02765224080',
      campusSize: '85 acres',
      collegeRating: 4.0,
      eligibilityPercentage: 48,
      status: 'active'
    },
    {
      name: 'RK University - School of Engineering',
      university: 'RK University',
      description: 'Leading university on Bhavnagar Highway Rajkot fostering industry projects and student innovation.',
      city: 'Rajkot',
      state: 'Gujarat',
      address: 'Bhavnagar Highway, Kasturbadham, Rajkot',
      collegeType: 'Private',
      establishedYear: 2005,
      website: 'https://rku.ac.in',
      email: 'info@rku.ac.in',
      phone: '02812785116',
      campusSize: '65 acres',
      collegeRating: 4.0,
      eligibilityPercentage: 45,
      status: 'active'
    },
    {
      name: 'Navrachana University - School of Engineering & Technology',
      university: 'Navrachana University',
      description: 'Premium private university in Vadodara focusing on interdisciplinary design, engineering, and management.',
      city: 'Vadodara',
      state: 'Gujarat',
      address: 'Vasna-Bhayli Road, Vadodara',
      collegeType: 'Private',
      establishedYear: 2011,
      website: 'https://nuv.ac.in',
      email: 'nuv@nuv.ac.in',
      phone: '02652617000',
      campusSize: '35 acres',
      collegeRating: 4.2,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'ITM (SLS) Baroda University',
      university: 'ITM Baroda University',
      description: 'Vibrant academic campus located near Jarod Vadodara with dynamic tech curriculum and industry mentoring.',
      city: 'Vadodara',
      state: 'Gujarat',
      address: 'Paldi, Near Jarod, Vadodara-Halol Highway, Vadodara',
      collegeType: 'Private',
      establishedYear: 2011,
      website: 'https://itmbu.ac.in',
      email: 'admission@itmbu.ac.in',
      phone: '02668275500',
      campusSize: '50 acres',
      collegeRating: 4.0,
      eligibilityPercentage: 48,
      status: 'active'
    },
    {
      name: 'C.K. Pithawalla College of Engineering and Technology',
      university: 'Gujarat Technological University (GTU)',
      description: 'Well-established engineering college in Surat situated near Dumas road offering core and computer programs.',
      city: 'Surat',
      state: 'Gujarat',
      address: 'Near Malvan Mandir, Via Magdalla Port, Dumas Road, Surat',
      collegeType: 'Private',
      establishedYear: 1998,
      website: 'https://ckpcet.ac.in',
      email: 'principal@ckpcet.ac.in',
      phone: '02612728282',
      campusSize: '25 acres',
      collegeRating: 3.9,
      eligibilityPercentage: 45,
      status: 'active'
    },
    {
      name: 'Babaria Institute of Technology (BITS Edu Campus)',
      university: 'Gujarat Technological University (GTU)',
      description: 'Renowned education campus on Vadodara-Mumbai Highway featuring modern research labs and seminar complexes.',
      city: 'Vadodara',
      state: 'Gujarat',
      address: 'Vadodara-Mumbai NH #8, Varnama, Vadodara',
      collegeType: 'Private',
      establishedYear: 2004,
      website: 'https://bitseducampus.org',
      email: 'bits@bitseducampus.org',
      phone: '02652303991',
      campusSize: '50 acres',
      collegeRating: 4.1,
      eligibilityPercentage: 48,
      status: 'active'
    },
    {
      name: 'Gandhinagar University - School of Technology',
      university: 'Gandhinagar University',
      description: 'State private university offering comprehensive technology programs with emphasis on practical training.',
      city: 'Gandhinagar',
      state: 'Gujarat',
      address: 'Khatraj-Kalol Road, Moti Bhoyan, Ta. Kalol',
      collegeType: 'Private',
      establishedYear: 2008,
      website: 'https://gandhinagaruni.ac.in',
      email: 'info@gandhinagaruni.ac.in',
      phone: '02764281860',
      campusSize: '40 acres',
      collegeRating: 3.9,
      eligibilityPercentage: 45,
      status: 'active'
    },
    {
      name: 'GLS University - Faculty of Computer Technology',
      university: 'GLS University',
      description: 'Prominent educational landmark in the heart of Ahmedabad with modern computer applications and AI programs.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: 'GLS Campus, Opp. Law Garden, Ellisbridge, Ahmedabad',
      collegeType: 'Private',
      establishedYear: 2015,
      website: 'https://glsuniversity.ac.in',
      email: 'inquiry@glsuniversity.ac.in',
      phone: '07926440532',
      campusSize: '20 acres',
      collegeRating: 4.2,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'Kadi Sarva Vishwavidyalaya (LDRP-ITR)',
      university: 'Kadi Sarva Vishwavidyalaya',
      description: 'Leuva Patel Sarva Vidyalaya institution recognized for academic discipline, state rankers, and corporate placements.',
      city: 'Gandhinagar',
      state: 'Gujarat',
      address: 'Sector 15, Near KH-5, Gandhinagar',
      collegeType: 'Private',
      establishedYear: 2005,
      website: 'https://ldrp.ac.in',
      email: 'info@ldrp.ac.in',
      phone: '07923241492',
      campusSize: '35 acres',
      collegeRating: 4.1,
      eligibilityPercentage: 50,
      status: 'active'
    },
    {
      name: 'GIDC Degree Engineering College (GDEC Abrama)',
      university: 'Gujarat Technological University (GTU)',
      description: 'Specialized degree engineering institute established by Gujarat Industrial Development Corporation in Abrama Navsari.',
      city: 'Navsari',
      state: 'Gujarat',
      address: 'Block No. 997, Abrama, Ta. Jalalpore, Dist. Navsari',
      collegeType: 'Government',
      establishedYear: 2012,
      website: 'https://gdec.in',
      email: 'gidcdegreengg@gmail.com',
      phone: '02637229040',
      campusSize: '25 acres',
      collegeRating: 3.9,
      eligibilityPercentage: 45,
      status: 'active'
    },
    {
      name: 'Swarrnim Startup & Innovation University',
      university: 'Swarrnim University',
      description: 'Innovation-centric university located in Bhoyan Rathod Gandhinagar fostering student entrepreneurship and patents.',
      city: 'Gandhinagar',
      state: 'Gujarat',
      address: 'Bhoyan Rathod, Opp. IFFCO, Gandhinagar',
      collegeType: 'Private',
      establishedYear: 2017,
      website: 'https://swarrnim.edu.in',
      email: 'info@swarrnim.edu.in',
      phone: '07923215264',
      campusSize: '30 acres',
      collegeRating: 3.9,
      eligibilityPercentage: 45,
      status: 'active'
    },
    {
      name: 'Gujarat Power Engineering and Research Institute (GPERI)',
      university: 'Gujarat Technological University (GTU)',
      description: 'Energy and technical research institute founded in Mewad Mehsana under state power sector sponsorship.',
      city: 'Mehsana',
      state: 'Gujarat',
      address: 'Near Toll Booth, Ahmedabad-Mehsana Express Highway, Mewad',
      collegeType: 'Government',
      establishedYear: 2011,
      website: 'https://gperi.ac.in',
      email: 'principal@gperi.ac.in',
      phone: '02762285871',
      campusSize: '35 acres',
      collegeRating: 4.0,
      eligibilityPercentage: 48,
      status: 'active'
    },
    {
      name: 'Atmiya University - Faculty of Engineering & Technology',
      university: 'Atmiya University',
      description: 'Sprawling campus in Rajkot known for holistic student development, computing labs, and regional placements.',
      city: 'Rajkot',
      state: 'Gujarat',
      address: 'Yogidham Gurukul, Kalawad Road, Rajkot',
      collegeType: 'Private',
      establishedYear: 2018,
      website: 'https://atmiyauni.ac.in',
      email: 'info@atmiyauni.ac.in',
      phone: '02812563445',
      campusSize: '30 acres',
      collegeRating: 4.0,
      eligibilityPercentage: 45,
      status: 'active'
    },
    {
      name: 'Uka Tarsadia University (UTU Maliba Campus)',
      university: 'Uka Tarsadia University',
      description: 'NAAC A+ accredited multi-faculty university campus in Gopal Vidyanagar Bardoli near Surat.',
      city: 'Bardoli',
      state: 'Gujarat',
      address: 'Maliba Campus, Gopal Vidyanagar, Bardoli-Mahuva Road, Tarsadi',
      collegeType: 'Private',
      establishedYear: 2011,
      website: 'https://utu.ac.in',
      email: 'admission@utu.ac.in',
      phone: '02625290074',
      campusSize: '80 acres',
      collegeRating: 4.1,
      eligibilityPercentage: 48,
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
