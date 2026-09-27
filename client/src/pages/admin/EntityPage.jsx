import React, { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Building2,
  GraduationCap,
  Users,
  BarChart3,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Shield,
  Mail,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';

const AVATAR_PALETTES = [
  'linear-gradient(135deg, #6C5CE7, #8E78FF)',
  'linear-gradient(135deg, #0984E3, #74B9FF)',
  'linear-gradient(135deg, #00B894, #55EFC4)',
  'linear-gradient(135deg, #E17055, #FAB1A0)',
  'linear-gradient(135deg, #6C5CE7, #FD79A8)',
  'linear-gradient(135deg, #2D3436, #636E72)',
  'linear-gradient(135deg, #E84393, #FD79A8)',
  'linear-gradient(135deg, #F39C12, #F1C40F)'
];

function getAvatarBackground(name = '') {
  let hash = 0;
  const str = String(name || '');
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[idx];
}

function getInitials(name = '') {
  if (!name || !String(name).trim()) return 'U';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const labels = {
  users: 'Users Directory',
  student_profiles: 'Student Profiles',
  academic_records: 'Academic Records',
  colleges: 'Colleges & Universities',
  courses: 'Courses & Degrees',
  college_courses: 'College Course Allocations',
  college_placements: 'Placements & CTC Records',
  college_fees: 'Tuition & Fee Structures',
  campus_facilities: 'Campus Infrastructure',
  saved_colleges: 'Student Saved Colleges',
  recommendations: 'AI Recommendation Logs'
};

const entityIcons = {
  colleges: Building2,
  courses: GraduationCap,
  college_courses: Layers,
  college_placements: BarChart3,
  college_fees: BarChart3,
  campus_facilities: Sparkles,
  users: Users,
  student_profiles: Users,
  academic_records: GraduationCap,
  saved_colleges: Sparkles,
  recommendations: Sparkles
};

const fields = {
  colleges: ['name', 'university', 'city', 'state', 'collegeType', 'establishedYear', 'collegeRating', 'eligibilityPercentage', 'website', 'email', 'phone', 'address', 'description', 'status'],
  courses: ['courseName', 'courseCode', 'level', 'duration', 'status', 'description'],
  college_courses: ['collegeId', 'courseId', 'availableSeats', 'eligibilityPercentage', 'admissionType', 'entranceRequired', 'status'],
  college_placements: ['collegeId', 'placementRate', 'averagePackage', 'highestPackage', 'lowestPackage', 'companiesVisited', 'placementYear'],
  college_fees: ['collegeId', 'courseId', 'annualTuitionFee', 'hostelFee', 'otherFees', 'totalAnnualFee', 'scholarshipAvailable', 'scholarshipDetails'],
  campus_facilities: ['collegeId', 'hostel', 'library', 'computerLab', 'wifi', 'sports', 'gym', 'cafeteria', 'transport', 'medicalFacility', 'auditorium', 'placementCell', 'campusSecurity'],
  users: ['name', 'email', 'phone', 'role', 'status', 'password'],
  student_profiles: ['userId', 'city', 'state', 'preferredLocation', 'careerGoal', 'budget', 'preferredCollegeType'],
  academic_records: ['studentId', 'tenthPercentage', 'twelfthPercentage', 'ugPercentage', 'entranceExam', 'entranceScore', 'passingYear'],
  saved_colleges: ['studentId', 'collegeId'],
  recommendations: ['studentId', 'collegeId', 'academicScore', 'courseMatchScore', 'budgetScore', 'placementScore', 'facilityScore', 'locationScore', 'overallScore', 'recommendationReason']
};

function displayValue(v) {
  if (v == null) return '—';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'object') {
    if (v.name) return v.name;
    if (v.courseName) return v.courseName;
    if (v.email) return v.email;
    if (v._id) return String(v._id).slice(-6);
    return JSON.stringify(v);
  }
  return String(v);
}

const FIELD_CONFIGS = {
  colleges: {
    name: {
      label: 'College / Institute Name',
      required: true,
      placeholder: 'e.g., Nirma University - Institute of Technology',
      helper: 'Official accredited name of the institution (3-150 characters)',
      validate: (v) => {
        if (!v || !String(v).trim()) return 'College name is required.';
        if (String(v).trim().length < 3) return 'College name must be at least 3 characters.';
        if (String(v).trim().length > 150) return 'College name cannot exceed 150 characters.';
        return null;
      }
    },
    university: {
      label: 'Affiliated University / Board',
      required: false,
      placeholder: 'e.g., Gujarat Technological University / Autonomous',
      helper: 'Parent university or governing board (if applicable)',
      validate: (v) => {
        if (v && String(v).trim().length < 2) return 'University must be at least 2 characters.';
        return null;
      }
    },
    city: {
      label: 'City',
      required: true,
      placeholder: 'e.g., Ahmedabad',
      helper: 'Campus city location',
      validate: (v) => {
        if (!v || !String(v).trim()) return 'City is required.';
        if (String(v).trim().length < 2) return 'City must be at least 2 characters.';
        return null;
      }
    },
    state: {
      label: 'State',
      required: true,
      placeholder: 'e.g., Gujarat',
      helper: 'State or Union Territory',
      validate: (v) => {
        if (!v || !String(v).trim()) return 'State is required.';
        if (String(v).trim().length < 2) return 'State must be at least 2 characters.';
        return null;
      }
    },
    collegeType: {
      label: 'College Type / Accreditation',
      required: true,
      type: 'select',
      options: [
        { value: '', label: 'Select College Type...' },
        { value: 'Government', label: 'Government' },
        { value: 'Private', label: 'Private' },
        { value: 'Autonomous', label: 'Autonomous' },
        { value: 'Deemed', label: 'Deemed University' }
      ],
      helper: 'Accreditation and management structure',
      validate: (v) => {
        if (!v) return 'Please select an accredited college type.';
        if (!['Government', 'Private', 'Autonomous', 'Deemed'].includes(v)) return 'Invalid college type selected.';
        return null;
      }
    },
    establishedYear: {
      label: 'Established Year',
      required: true,
      type: 'number',
      placeholder: 'e.g., 1995',
      helper: `Year of founding (1800 - ${new Date().getFullYear()})`,
      validate: (v) => {
        if (v === '' || v == null) return 'Established year is required.';
        const yr = Number(v);
        const curr = new Date().getFullYear();
        if (isNaN(yr) || !Number.isInteger(yr)) return 'Established year must be a valid integer year.';
        if (yr < 1800 || yr > curr) return `Year must be between 1800 and ${curr}.`;
        return null;
      }
    },
    collegeRating: {
      label: 'College Rating (0.0 - 5.0)',
      required: true,
      type: 'number',
      step: '0.1',
      placeholder: 'e.g., 4.4',
      helper: 'Accredited rating from 0.0 to 5.0 stars',
      validate: (v) => {
        if (v === '' || v == null) return 'College rating is required.';
        const r = Number(v);
        if (isNaN(r)) return 'Rating must be a number.';
        if (r < 0 || r > 5) return 'Rating must be between 0.0 and 5.0 stars.';
        return null;
      }
    },
    eligibilityPercentage: {
      label: 'Cutoff / Eligibility %',
      required: true,
      type: 'number',
      step: '0.1',
      placeholder: 'e.g., 60.0',
      helper: 'Minimum qualifying percentage (0 - 100%)',
      validate: (v) => {
        if (v === '' || v == null) return 'Eligibility percentage is required.';
        const p = Number(v);
        if (isNaN(p)) return 'Must be a valid percentage.';
        if (p < 0 || p > 100) return 'Percentage must be between 0% and 100%.';
        return null;
      }
    },
    website: {
      label: 'Official Website URL',
      required: false,
      type: 'url',
      placeholder: 'https://www.nirmauni.ac.in',
      helper: 'Official website address (optional)',
      validate: (v) => {
        if (!v || !String(v).trim()) return null;
        const val = String(v).trim();
        const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
        if (!urlPattern.test(val)) return 'Please enter a valid website URL (e.g. https://college.edu).';
        return null;
      }
    },
    email: {
      label: 'Admissions Email',
      required: true,
      type: 'email',
      placeholder: 'admissions@nirmauni.ac.in',
      helper: 'Official contact email address',
      validate: (v) => {
        if (!v || !String(v).trim()) return 'Email address is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(v).trim())) return 'Please enter a valid email address (e.g. name@domain.edu).';
        return null;
      }
    },
    phone: {
      label: 'Contact Phone',
      required: false,
      type: 'tel',
      placeholder: 'e.g., +91 79 7165 2000',
      helper: 'Official telephone or mobile number (optional)',
      validate: (v) => {
        if (!v || !String(v).trim()) return null;
        const digits = String(v).replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number (7 to 15 digits).';
        return null;
      }
    },
    address: {
      label: 'Campus Street Address',
      required: false,
      type: 'textarea',
      rows: 2,
      placeholder: 'e.g., Sarkhej-Gandhinagar Highway, Post: Chandlodiya, Gota',
      helper: 'Campus location and landmark details',
      validate: (v) => {
        if (v && String(v).length > 400) return 'Address cannot exceed 400 characters.';
        return null;
      }
    },
    description: {
      label: 'Description & Highlights',
      required: false,
      type: 'textarea',
      rows: 3,
      placeholder: 'Overview of academic programs, campus culture, research centers, and accreditations...',
      helper: 'Maximum 1500 characters',
      validate: (v) => {
        if (v && String(v).length > 1500) return 'Description cannot exceed 1500 characters.';
        return null;
      }
    },
    status: {
      label: 'Directory Listing Status',
      required: true,
      type: 'select',
      options: [
        { value: 'active', label: 'Active (Visible in Directory)' },
        { value: 'inactive', label: 'Inactive (Hidden / Draft)' }
      ],
      helper: 'Controls visibility to prospective students',
      validate: (v) => {
        if (!v) return 'Please select a status.';
        if (!['active', 'inactive'].includes(v)) return 'Status must be active or inactive.';
        return null;
      }
    }
  },
  users: {
    name: {
      label: 'Full Name',
      required: true,
      placeholder: 'e.g., Diya Shah',
      helper: 'User’s full legal or preferred display name',
      validate: (v) => {
        if (!v || !String(v).trim()) return 'Full name is required.';
        if (String(v).trim().length < 2) return 'Full name must be at least 2 characters.';
        if (String(v).trim().length > 70) return 'Full name cannot exceed 70 characters.';
        return null;
      }
    },
    email: {
      label: 'Email Address',
      required: true,
      type: 'email',
      placeholder: 'e.g., diya.shah@gmail.com',
      helper: 'Primary email used for sign-in and platform notifications',
      validate: (v) => {
        if (!v || !String(v).trim()) return 'Email address is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(v).trim())) return 'Please enter a valid email address (e.g. user@example.com).';
        return null;
      }
    },
    phone: {
      label: 'Contact Phone Number',
      required: false,
      type: 'tel',
      placeholder: 'e.g., 9879022334',
      helper: '10-digit mobile or direct contact number (optional)',
      validate: (v) => {
        if (!v || !String(v).trim()) return null;
        const digits = String(v).replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number (7 to 15 digits).';
        return null;
      }
    },
    role: {
      label: 'System Access Role',
      required: true,
      type: 'select',
      options: [
        { value: 'user', label: 'User / Student (Standard Portal Access)' },
        { value: 'admin', label: 'Administrator (Full Management Access)' }
      ],
      helper: 'Determines administrative permissions across the portal',
      validate: (v) => {
        if (!v) return 'Role is required.';
        if (!['user', 'admin'].includes(v)) return 'Invalid role selected.';
        return null;
      }
    },
    status: {
      label: 'Account Access Status',
      required: true,
      type: 'select',
      options: [
        { value: 'active', label: 'Active (Allowed to sign in)' },
        { value: 'inactive', label: 'Inactive / Suspended (Login disabled)' }
      ],
      helper: 'Manage user access and authorization privilege',
      validate: (v) => {
        if (!v) return 'Status is required.';
        if (!['active', 'inactive'].includes(v)) return 'Status must be active or inactive.';
        return null;
      }
    },
    password: {
      label: (editing) => editing === 'new' ? 'Account Password' : 'Reset Password (Optional)',
      required: (editing) => editing === 'new',
      type: 'password',
      placeholder: (editing) => editing === 'new' ? 'Minimum 6 characters...' : 'Leave blank to preserve existing password',
      helper: (editing) => editing === 'new' ? 'Required for user authentication (min 6 characters)' : 'Only enter a value if you wish to reset this user’s password',
      validate: (v, form, editing) => {
        if (editing === 'new') {
          if (!v || !String(v).trim()) return 'Password is required for a new account.';
          if (String(v).trim().length < 6) return 'Password must be at least 6 characters.';
        } else {
          if (v && String(v).trim().length > 0 && String(v).trim().length < 6) {
            return 'New password must be at least 6 characters if you wish to change it.';
          }
        }
        return null;
      }
    }
  }
};

function getFieldConfig(entity, f, editing = 'new') {
  if (FIELD_CONFIGS[entity] && FIELD_CONFIGS[entity][f]) {
    const raw = FIELD_CONFIGS[entity][f];
    return {
      ...raw,
      label: typeof raw.label === 'function' ? raw.label(editing) : raw.label,
      required: typeof raw.required === 'function' ? raw.required(editing) : raw.required,
      placeholder: typeof raw.placeholder === 'function' ? raw.placeholder(editing) : raw.placeholder,
      helper: typeof raw.helper === 'function' ? raw.helper(editing) : raw.helper
    };
  }

  const isStatus = f === 'status';
  const isEmail = f.toLowerCase().includes('email');
  const isPassword = f.toLowerCase().includes('password');
  const isRole = f === 'role';
  const isNumber = ['collegeRating', 'eligibilityPercentage', 'establishedYear', 'budget', 'tenthPercentage', 'twelfthPercentage', 'ugPercentage', 'entranceScore', 'passingYear', 'availableSeats', 'placementRate', 'averagePackage', 'highestPackage', 'lowestPackage', 'companiesVisited', 'placementYear', 'annualTuitionFee', 'hostelFee', 'otherFees', 'totalAnnualFee', 'academicScore', 'courseMatchScore', 'budgetScore', 'placementScore', 'facilityScore', 'locationScore', 'overallScore'].includes(f);
  const isTextarea = ['description', 'address', 'scholarshipDetails', 'recommendationReason'].includes(f);

  if (isStatus) {
    return {
      label: 'Status',
      required: true,
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      validate: v => (!v ? 'Status is required.' : null)
    };
  }

  if (isRole) {
    return {
      label: 'User Role',
      required: true,
      type: 'select',
      options: [
        { value: 'student', label: 'Student' },
        { value: 'counselor', label: 'Counselor' },
        { value: 'admin', label: 'Administrator' }
      ],
      validate: v => (!v ? 'Role is required.' : null)
    };
  }

  return {
    label: f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    required: ['name', 'courseName'].includes(f),
    type: isTextarea ? 'textarea' : isNumber ? 'number' : isEmail ? 'email' : isPassword ? 'password' : 'text',
    placeholder: `Enter ${f}...`,
    validate: (v) => {
      if (['name', 'courseName'].includes(f) && (!v || !String(v).trim())) {
        return `${f} is required.`;
      }
      if (isEmail && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())) {
        return 'Please enter a valid email address.';
      }
      return null;
    }
  };
}

export default function EntityPage({ entity }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formAlert, setFormAlert] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchInputRef = useRef(null);

  const fs = fields[entity] || [];
  const IconComponent = entityIcons[entity] || Layers;
  const hasStatus = fs.includes('status');
  const displayFields = fs.filter(f => f !== 'status' && f !== 'password').slice(0, 6);
  const activeCount = data.filter(x => x.status === 'active').length;
  const inactiveCount = data.filter(x => x.status === 'inactive').length;
  const [showPassword, setShowPassword] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/admin/entities/${entity}`)
      .then(r => setData(r.data.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    api.get(`/admin/entities/${entity}`)
      .then(r => setData(r.data.data || []))
      .catch(() => setData([]))
      .finally(() => {
        setTimeout(() => setIsRefreshing(false), 400);
      });
  };

  const handleToggleStatus = async (row) => {
    const newStatus = row.status === 'active' ? 'inactive' : 'active';
    setTogglingId(row._id);

    // Optimistic UI update
    setData(prev => prev.map(item => item._id === row._id ? { ...item, status: newStatus } : item));

    try {
      await api.put(`/admin/entities/${entity}/${row._id}`, { status: newStatus });
    } catch (err) {
      // Revert on error
      setData(prev => prev.map(item => item._id === row._id ? { ...item, status: row.status } : item));
      alert(err.response?.data?.message || 'Failed to update record status');
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    load();
    setEditing(null);
    setSearch('');
    setStatusFilter('all');
    setCurrentPage(1);
  }, [entity]);

  // Pressing "/" focuses the table search bar (unless already typing in an input)
  useEffect(() => {
    const handleSlash = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleSlash);
    return () => window.removeEventListener('keydown', handleSlash);
  }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const startEdit = (x) => {
    setEditing(x?._id || 'new');
    setErrors({});
    setTouched({});
    setFormAlert(null);
    setShowPassword(false);
    if (x) {
      setForm({ ...x, password: '' });
    } else {
      // Set sensible defaults for new record
      const initialForm = Object.fromEntries(fs.map(f => {
        if (f === 'status') return [f, 'active'];
        if (f === 'role' && entity === 'users') return [f, 'user'];
        if (f === 'collegeType' && entity === 'colleges') return [f, 'Private'];
        return [f, ''];
      }));
      setForm(initialForm);
    }
  };

  const handleFieldChange = (f, val) => {
    setForm(prev => ({ ...prev, [f]: val }));
    // If field was already touched, validate in real time
    if (touched[f]) {
      const config = getFieldConfig(entity, f, editing);
      const err = config.validate ? config.validate(val, { ...form, [f]: val }, editing) : null;
      setErrors(prev => ({ ...prev, [f]: err }));
    }
  };

  const handleFieldBlur = (f) => {
    setTouched(prev => ({ ...prev, [f]: true }));
    const config = getFieldConfig(entity, f, editing);
    const err = config.validate ? config.validate(form[f], form, editing) : null;
    setErrors(prev => ({ ...prev, [f]: err }));
  };

  const save = async (e) => {
    e.preventDefault();
    setFormAlert(null);

    // Validate ALL fields in fs
    const newErrors = {};
    const allTouched = {};
    fs.forEach(f => {
      // For users: if editing existing user and password is empty, don't validate password as required
      if (entity === 'users' && f === 'password' && editing !== 'new' && (!form[f] || !String(form[f]).trim())) {
        return;
      }
      allTouched[f] = true;
      const config = getFieldConfig(entity, f, editing);
      if (config.validate) {
        const err = config.validate(form[f], form, editing);
        if (err) newErrors[f] = err;
      }
    });

    setTouched(allTouched);
    setErrors(newErrors);

    const errorKeys = Object.keys(newErrors).filter(k => newErrors[k]);
    if (errorKeys.length > 0) {
      setFormAlert(`Please fix the ${errorKeys.length} highlighted validation error${errorKeys.length > 1 ? 's' : ''} before saving.`);
      const modalForm = document.querySelector('.admin-drawer-modal form');
      if (modalForm) modalForm.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const clean = { ...form };
    // If editing existing user and password is left empty, omit it from payload so password isn't overwritten
    if (entity === 'users' && editing !== 'new' && (!clean.password || !String(clean.password).trim())) {
      delete clean.password;
    }

    Object.keys(clean).forEach(k => {
      if (clean[k] === '') delete clean[k];
      const config = getFieldConfig(entity, k, editing);
      if (config.type === 'number' && clean[k] != null) {
        clean[k] = Number(clean[k]);
      }
    });

    setIsSaving(true);
    try {
      if (editing === 'new') {
        await api.post(`/admin/entities/${entity}`, clean);
      } else {
        await api.put(`/admin/entities/${entity}/${editing}`, clean);
      }
      setEditing(null);
      load();
    } catch (err) {
      setFormAlert(err.response?.data?.message || 'Error saving record. Please review your input.');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/admin/entities/${entity}/${id}`);
      setDeleteConfirmId(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting record');
    }
  };

  const filtered = data.filter(x => {
    const matchesSearch = JSON.stringify(x).toLowerCase().includes(search.toLowerCase());
    if (hasStatus && statusFilter === 'active') return matchesSearch && x.status === 'active';
    if (hasStatus && statusFilter === 'inactive') return matchesSearch && x.status === 'inactive';
    return matchesSearch;
  });

  const totalRecords = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Top Banner Card */}
      <div className="admin-entity-banner">
        <div className="admin-entity-meta-wrap">
          <div className="admin-entity-icon-tile">
            <IconComponent size={24} />
          </div>
          <div>
            <div className="admin-entity-breadcrumbs">
              <span className="admin-crumb-tag">Database Collection</span>
              <span className="admin-crumb-dot">•</span>
              <span className="admin-crumb-model">{entity}</span>
            </div>
            <h2 className="admin-entity-title">
              {labels[entity] || entity}
            </h2>
            <div className="admin-entity-stats">
              <span className="admin-live-pulse-dot" />
              <span className="admin-stats-highlight">{data.length} total records</span>
              {search && (
                <>
                  <span className="admin-crumb-dot">•</span>
                  <span className="admin-search-matches">{filtered.length} matching filter</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls: Search Box, Refresh Button, Add Record Button */}
        <div className="admin-entity-controls">
          {/* High-End Search Box */}
          <div className={`admin-table-search-box ${search ? 'has-value' : ''}`}>
            <Search size={16} className="admin-table-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={`Search in ${entity}...`}
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              className="admin-table-search-input"
            />
            {search ? (
              <button
                type="button"
                className="admin-table-search-clear"
                onClick={() => handleSearchChange('')}
                title="Clear search filter"
              >
                <X size={14} />
              </button>
            ) : (
              <kbd className="admin-table-search-kbd" title="Press / to search">
                <span>/</span>
              </kbd>
            )}
          </div>

          {/* Segmented Active / Inactive Filter */}
          {hasStatus && (
            <div className="admin-segmented-filter">
              <button
                type="button"
                className={`admin-segment-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                title="Show all records"
              >
                <span>All</span>
                <span className="admin-segment-count">{data.length}</span>
              </button>
              <button
                type="button"
                className={`admin-segment-btn ${statusFilter === 'active' ? 'active' : ''}`}
                onClick={() => { setStatusFilter('active'); setCurrentPage(1); }}
                title="Show active records only"
              >
                <span className="admin-segment-dot active" />
                <span>Active</span>
                <span className="admin-segment-count">{activeCount}</span>
              </button>
              <button
                type="button"
                className={`admin-segment-btn ${statusFilter === 'inactive' ? 'active' : ''}`}
                onClick={() => { setStatusFilter('inactive'); setCurrentPage(1); }}
                title="Show inactive records only"
              >
                <span className="admin-segment-dot inactive" />
                <span>Inactive</span>
                <span className="admin-segment-count">{inactiveCount}</span>
              </button>
            </div>
          )}

          {/* Quick Refresh Button */}
          <button
            type="button"
            className="admin-table-icon-btn"
            onClick={handleRefresh}
            title="Refresh database records"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin-anim' : ''} />
          </button>

          {/* Primary CTA: Add Record */}
          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => startEdit()}
          >
            <Plus size={18} />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* ADD / EDIT DRAWER MODAL */}
      {editing && (
        <div className="admin-drawer-overlay" onClick={() => setEditing(null)}>
          <div
            className="admin-drawer-modal"
            style={{ maxWidth: '850px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#F0EDFE',
                    color: '#6C5CE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Plus size={20} />
                </div>
                <h4 style={{ margin: 0, fontWeight: '800', color: 'var(--adm-text-dark, #1E1B4B)' }}>
                  {entity === 'users'
                    ? (editing === 'new' ? 'Create New User Account' : 'Edit User Account')
                    : `${editing === 'new' ? 'Create New' : 'Edit'} ${labels[entity] || entity} Record`
                  }
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setEditing(null)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '1px solid #E5E9F4',
                  background: '#F8FAFD',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} color="#7E84A3" />
              </button>
            </div>

            <form onSubmit={save} style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
              {formAlert && (
                <div className="admin-form-alert">
                  <AlertTriangle size={18} className="flex-shrink-0" />
                  <span className="flex-grow-1">{formAlert}</span>
                  <button
                    type="button"
                    onClick={() => setFormAlert(null)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit', display: 'flex' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              <div className="admin-form-header-note">
                <span className="admin-required-star">*</span>
                <span>Fields marked with an asterisk are required and must pass schema validation before saving.</span>
              </div>

              <div className="row g-3">
                {fs.map(f => {
                  const config = getFieldConfig(entity, f, editing);
                  const isFullWidth = ['description', 'address', 'scholarshipDetails', 'recommendationReason'].includes(f);
                  const hasError = touched[f] && Boolean(errors[f]);
                  const isValid = touched[f] && !errors[f] && form[f] !== '' && form[f] != null;

                  return (
                    <div className={isFullWidth ? 'col-12' : 'col-md-6'} key={f}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="admin-form-label">
                          <span>{config.label}</span>
                          {config.required && <span className="admin-required-star">*</span>}
                        </label>
                        {isValid && (
                          <span className="admin-valid-indicator">
                            <Check size={12} /> Valid
                          </span>
                        )}
                      </div>

                      {f === 'status' ? (
                        <div className="admin-form-toggle-row">
                          <div className="admin-form-toggle-info">
                            <span className="admin-form-toggle-title">
                              {entity === 'users' ? 'Account Access Status' : 'Directory Visibility Status'}
                            </span>
                            <span className="admin-form-toggle-desc">
                              {form.status === 'active'
                                ? (entity === 'users' ? 'Active: User has full system access and can log in.' : 'Active: Published in colleges directory & AI recommendation engine.')
                                : (entity === 'users' ? 'Inactive: User account is suspended and cannot log in.' : 'Inactive: Hidden from prospective students and recommendation matches.')}
                            </span>
                          </div>
                          <button
                            type="button"
                            className={`admin-form-switch-btn ${form.status === 'active' ? 'is-active' : 'is-inactive'}`}
                            onClick={() => handleFieldChange('status', form.status === 'active' ? 'inactive' : 'active')}
                          >
                            <span className="admin-form-switch-track">
                              <span className="admin-form-switch-thumb" />
                            </span>
                            <span className="admin-form-switch-label">
                              {form.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </button>
                        </div>
                      ) : config.type === 'password' ? (
                        <div className="admin-password-input-wrap">
                          <input
                            className={`admin-input-clean ${hasError ? 'admin-input-error' : isValid ? 'admin-input-valid' : ''}`}
                            type={showPassword ? 'text' : 'password'}
                            value={form[f] ?? ''}
                            onChange={e => handleFieldChange(f, e.target.value)}
                            onBlur={() => handleFieldBlur(f)}
                            placeholder={config.placeholder}
                          />
                          <button
                            type="button"
                            className="admin-password-toggle-eye"
                            onClick={() => setShowPassword(prev => !prev)}
                            tabIndex={-1}
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      ) : config.type === 'select' ? (
                        <div className="position-relative">
                          <select
                            className={`admin-select-clean ${hasError ? 'admin-input-error' : isValid ? 'admin-input-valid' : ''}`}
                            value={form[f] ?? ''}
                            onChange={e => handleFieldChange(f, e.target.value)}
                            onBlur={() => handleFieldBlur(f)}
                          >
                            {config.options.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : config.type === 'textarea' ? (
                        <textarea
                          className={`admin-input-clean ${hasError ? 'admin-input-error' : isValid ? 'admin-input-valid' : ''}`}
                          rows={config.rows || 3}
                          value={form[f] ?? ''}
                          onChange={e => handleFieldChange(f, e.target.value)}
                          onBlur={() => handleFieldBlur(f)}
                          placeholder={config.placeholder}
                        />
                      ) : (
                        <input
                          className={`admin-input-clean ${hasError ? 'admin-input-error' : isValid ? 'admin-input-valid' : ''}`}
                          type={config.type || 'text'}
                          step={config.step}
                          min={config.min}
                          max={config.max}
                          value={typeof form[f] === 'object' ? displayValue(form[f]) : (form[f] ?? '')}
                          onChange={e => handleFieldChange(f, e.target.value)}
                          onBlur={() => handleFieldBlur(f)}
                          placeholder={config.placeholder}
                        />
                      )}

                      {hasError ? (
                        <div className="admin-input-error-msg">
                          <AlertCircle size={13} className="flex-shrink-0" />
                          <span>{errors[f]}</span>
                        </div>
                      ) : config.helper ? (
                        <div className="admin-input-helper-msg">{config.helper}</div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <div style={{ fontSize: '12px', color: '#7E84A3' }}>
                  Real-time validation active
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="admin-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw size={16} className="spin-anim" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Save Record</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="admin-entity-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7E84A3' }}>
            <div className="spinner-border text-primary mb-2" role="status" />
            <div>Loading records...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#F0EDFE',
                color: '#6C5CE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Search size={28} />
            </div>
            <h4 style={{ fontWeight: '800', color: 'var(--adm-text-dark, #1E1B4B)', marginBottom: '6px' }}>
              No records found
            </h4>
            <p style={{ color: '#7E84A3', fontSize: '13px', maxWidth: '380px', margin: '0 auto 16px' }}>
              {search
                ? `No ${entity} matches your search query "${search}". Try resetting the search.`
                : `There are currently no entries in this collection. Click below to add the first record.`}
            </p>
            <button
              type="button"
              className="admin-btn-primary"
              onClick={() => startEdit()}
            >
              <Plus size={16} />
              <span>Add First Record</span>
            </button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
            <table className="admin-table-clean">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  {displayFields.map(f => (
                    <th key={f}>
                      {f === 'name' && entity === 'users' ? 'USER' : f.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </th>
                  ))}
                  {hasStatus && <th style={{ width: '140px' }}>STATUS</th>}
                  <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(x => (
                  <tr key={x._id}>
                    <td>
                      <span
                        style={{
                          background: '#F0EDFE',
                          color: '#6C5CE7',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: '700',
                          fontSize: '11px'
                        }}
                      >
                        #{x._id.slice(-5)}
                      </span>
                    </td>

                    {displayFields.map(f => {
                      // Premium presentation for Users collection
                      if (entity === 'users') {
                        if (f === 'name') {
                          return (
                            <td key={f}>
                              <div className="admin-user-cell">
                                <div className="admin-user-avatar" style={{ background: getAvatarBackground(x.name) }}>
                                  {getInitials(x.name)}
                                </div>
                                <div className="admin-user-meta">
                                  <span className="admin-user-name">{x.name || 'Unnamed User'}</span>
                                  {x.createdAt && (
                                    <span className="admin-user-sub">
                                      Joined {new Date(x.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        }
                        if (f === 'email') {
                          return (
                            <td key={f}>
                              <span className="admin-contact-pill">
                                <Mail size={13} />
                                <span>{x.email}</span>
                              </span>
                            </td>
                          );
                        }
                        if (f === 'phone') {
                          return (
                            <td key={f}>
                              <span className="admin-contact-pill">
                                <Phone size={13} />
                                <span style={{ fontFamily: 'monospace', letterSpacing: '0.3px' }}>{x.phone || '—'}</span>
                              </span>
                            </td>
                          );
                        }
                        if (f === 'role') {
                          const roleStr = String(x.role || 'user').toLowerCase();
                          return (
                            <td key={f}>
                              <span className={`admin-role-badge role-${roleStr}`}>
                                {roleStr === 'admin' && <Shield size={12} style={{ marginRight: '4px' }} />}
                                {roleStr === 'admin' ? 'Administrator' : roleStr === 'counselor' ? 'Counselor' : 'Student'}
                              </span>
                            </td>
                          );
                        }
                      }

                      return (
                        <td key={f}>
                          <span style={{ fontWeight: f.toLowerCase().includes('name') ? '700' : '500' }}>
                            {displayValue(x[f])}
                          </span>
                        </td>
                      );
                    })}

                    {hasStatus && (
                      <td style={{ verticalAlign: 'middle' }}>
                        <button
                          type="button"
                          className={`admin-status-toggle-pill ${x.status === 'active' ? 'is-active' : 'is-inactive'}`}
                          onClick={() => handleToggleStatus(x)}
                          disabled={togglingId === x._id}
                          title={`Click to set as ${x.status === 'active' ? 'Inactive' : 'Active'}`}
                        >
                          <span className="admin-status-toggle-track">
                            <span className="admin-status-toggle-thumb" />
                          </span>
                          <span className="admin-status-toggle-text">
                            {x.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </button>
                      </td>
                    )}

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="admin-action-btn-sm edit"
                          onClick={() => startEdit(x)}
                          title="Edit Record"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          className="admin-action-btn-sm del"
                          onClick={() => setDeleteConfirmId(x._id)}
                          title="Delete Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          {totalRecords > 0 && (
            <div
              className="admin-pagination-bar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 8px 4px',
                flexWrap: 'wrap',
                gap: '12px',
                borderTop: '1px solid var(--adm-border-soft, #EEF1F8)',
                marginTop: '12px'
              }}
            >
              {/* Records Count Summary */}
              <div style={{ fontSize: '13px', color: '#7E84A3', fontWeight: '500' }}>
                Showing{' '}
                <strong style={{ color: 'var(--adm-text-dark, #1E1B4B)' }}>
                  {startIndex + 1}–{Math.min(startIndex + pageSize, totalRecords)}
                </strong>{' '}
                of <strong style={{ color: 'var(--adm-text-dark, #1E1B4B)' }}>{totalRecords}</strong> entries
              </div>

              {/* Rows Per Page & Navigation Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {/* Page Size Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#7E84A3' }}>
                  <span>Rows per page:</span>
                  <select
                    className="admin-page-size-select"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{
                      border: '1px solid var(--adm-border-soft, #E2E6F2)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--adm-text-dark, #1E1B4B)',
                      background: 'var(--adm-white, #FFFFFF)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Page Navigation Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <button
                    type="button"
                    className="admin-page-nav-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={safeCurrentPage <= 1}
                    style={{
                      height: '32px',
                      padding: '0 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--adm-border-soft, #E2E6F2)',
                      background: 'var(--adm-white, #FFFFFF)',
                      color: safeCurrentPage <= 1 ? '#C0C4D6' : 'var(--adm-text-dark, #1E1B4B)',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: safeCurrentPage <= 1 ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.18s'
                    }}
                  >
                    <ChevronLeft size={14} />
                    <span>Prev</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                    if (
                      totalPages > 7 &&
                      pageNum !== 1 &&
                      pageNum !== totalPages &&
                      Math.abs(pageNum - safeCurrentPage) > 1
                    ) {
                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return <span key={pageNum} style={{ color: '#A0A5BA', padding: '0 4px', fontSize: '12px' }}>…</span>;
                      }
                      return null;
                    }

                    const isActive = pageNum === safeCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        className={`admin-page-number-btn ${isActive ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: isActive ? 'none' : '1px solid var(--adm-border-soft, #E2E6F2)',
                          background: isActive ? 'var(--adm-purple-primary, #6C5CE7)' : 'var(--adm-white, #FFFFFF)',
                          color: isActive ? '#FFFFFF' : 'var(--adm-text-dark, #1E1B4B)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isActive ? '0 4px 12px rgba(108, 92, 231, 0.3)' : 'none',
                          transition: 'all 0.18s'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className="admin-page-nav-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={safeCurrentPage >= totalPages}
                    style={{
                      height: '32px',
                      padding: '0 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--adm-border-soft, #E2E6F2)',
                      background: 'var(--adm-white, #FFFFFF)',
                      color: safeCurrentPage >= totalPages ? '#C0C4D6' : 'var(--adm-text-dark, #1E1B4B)',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: safeCurrentPage >= totalPages ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.18s'
                    }}
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="admin-drawer-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div
            className="admin-drawer-modal"
            style={{ maxWidth: '420px', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#FFE8EF',
                color: '#FF4472',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Trash2 size={26} />
            </div>

            <h4 style={{ fontWeight: '800', color: 'var(--adm-text-dark, #1E1B4B)', marginBottom: '8px' }}>
              Delete Record?
            </h4>
            <p style={{ color: '#7E84A3', fontSize: '13px', marginBottom: '24px' }}>
              Are you sure you want to permanently delete record <strong>#{deleteConfirmId.slice(-6)}</strong>? This action cannot be undone.
            </p>

            <div className="d-flex justify-content-center gap-3">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn-pink"
                onClick={() => remove(deleteConfirmId)}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
