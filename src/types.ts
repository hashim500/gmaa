export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department: string;
  level?: string;
  avatarUrl?: string;
  photoUrl?: string;
  phone?: string;
  nationalId?: string;
  academicYear?: string;
  gpa?: string | number;
  status?: string;
  bloodGroup?: string;
  // Student and Instructor Profile Extensions
  bio?: string;
  skills?: string;
  coursesCompleted?: string;
  projects?: string;
  college?: string;
  officeHours?: string;
  officeLocation?: string;
  academicTitle?: string;
  researchPapers?: string[];
  professionalMemberships?: string[];
  coursesTaught?: string[];
}

export interface Lecture {
  id: string;
  title: string;
  course: string;
  instructor: string;
  date?: string;
  time?: string;
  duration: string;
  youtubeUrl?: string;
  videoId?: string;
  youtubeId?: string;
  isLive?: boolean;
  isVisibleToStudents?: boolean; // Admin controls whether students can see this lecture
  description: string;
  resources?: { name: string; url: string; size: string }[];
}



export type AssignmentFormat = 'text_only' | 'video' | 'image' | 'document' | 'general';
export type SubmissionFormat = 'video' | 'image' | 'document' | 'text';

export interface Assignment {
  id: string;
  title: string;
  course: string;
  instructor: string;
  dueDate: string;
  maxScore: number;
  description: string;
  instructions: string;
  type?: 'text' | 'video' | 'image' | 'file';
  fileName?: string;
  format?: AssignmentFormat;
  mediaType?: 'video' | 'image' | 'document' | 'none';
  mediaUrl?: string;
  mediaTitle?: string;
  attachments?: string[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  course: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  notes: string;
  fileType?: 'document' | 'image' | 'video' | 'text';
  submissionType?: SubmissionFormat;
  fileName: string;
  fileSize?: string;
  fileData?: string; // base64 or simulated content / image preview URL
  mediaUrl?: string;
  status: 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  points: number;
  explanation?: string;
}

export interface ScheduleItem {
  id: string;
  dayOfWeek: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  dayNameAr: string;
  course: string;
  instructor: string;
  time: string;
  duration: string;
  roomOrLink: string;
  lectureId?: string;
  order: number;
  isCompleted?: boolean;
  notes?: string;
  color?: string;
}

export interface Quiz {
  id: string;
  title: string;
  course: string;
  durationMinutes: number;
  totalScore: number;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalScore: number;
  percentage: number;
  submittedAt: string;
  answers: Record<string, number>;
}

export interface CertificateRequest {
  id: string;
  studentName: string;
  studentId: string;
  nationalId?: string;
  certType: string;
  deliveryMethod: 'digital' | 'in_person';
  notes?: string;
  status: 'pending' | 'approved' | 'ready';
  requestedAt: string;
  serialNumber: string;
  approvedAt?: string;
  gpa?: string;
  graduationYear?: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  term: string;
  paymentMethod: 'bankak' | 'fawry' | 'onb' | 'card';
  referenceNumber: string;
  notes?: string;
  date: string;
  status: 'verified' | 'pending';
  receiptNumber: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  department: string;
  isUrgent?: boolean;
  category: 'academic' | 'exams' | 'financial' | 'general';
}

export interface TranscriptCourse {
  code: string;
  title: string;
  creditHours: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  points: number;
  totalMark: number;
}

export interface TranscriptSemester {
  id: string;
  semesterName: string;
  academicYear: string;
  courses: TranscriptCourse[];
  semesterGpa: number;
  cumulativeGpa: number;
  earnedHours: number;
}

export interface StudentTranscript {
  studentId: string;
  studentName: string;
  nationalId: string;
  faculty: string;
  department: string;
  degree: string;
  admissionYear: string;
  graduationYear?: string;
  cumulativeGpa: number;
  totalCreditHours: number;
  academicStanding: string;
  semesters: TranscriptSemester[];
}

export interface DocumentVerificationRecord {
  serialNumber: string;
  documentType: 'شهادة تخرج بكالوريوس' | 'كشف درجات معتمد' | 'إفادة قيد أكاديمي' | 'سند سداد رسوم';
  studentName: string;
  studentId: string;
  nationalId: string;
  issueDate: string;
  status: 'valid' | 'revoked' | 'under_review';
  gpa?: string;
  honors?: string;
  faculty: string;
  issuedBy: string;
  qrHash: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  author: string;
  category: string;
  year: string;
  pages: number;
  fileSize: string;
  format: 'PDF' | 'DOCX' | 'XLSX';
  downloadCount: number;
  description: string;
  tags: string[];
  dataUrl?: string;
  directUrl?: string;
  sourceType?: 'file' | 'url';
  fileName?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  course?: string;
  isVisibleToStudents?: boolean;
  allowDownload?: boolean;
  contentSample?: string;
}

export interface OnlineBook {
  id: number;
  title: string;
  author: string;
  category: string;
  cover: string;
  description: string;
  content: string;
  pages?: number;
  year?: string;
  isbn?: string;
}

export interface RegistrationSettings {
  isOpen: boolean; // true = registration open, false = closed by admin
  academicYear: string; // e.g. '2026/2027'
  reopenDate: string; // when closed, exact date/time when registration opens (e.g. '15 أكتوبر 2026 الساعة 09:00 صباحاً')
  announcementTitle: string;
  closedMessage: string;
  minSecondaryPercentage: number;
  contactEmail: string;
  contactPhone: string;
}

export interface NewStudentApplication {
  id?: string;
  ref: string; // e.g., 'NSCA-2026-0001'
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  data: {
    nameAr: string;
    nameEn: string;
    idType: 'national' | 'passport';
    idNumber: string;
    nationality: string;
    dob: string;
    age: number;
    gender: 'male' | 'female';
    residenceCountry: string;
    city: string;
    email: string;
    dial: string;
    phone: string;
    address: string;
    level: 'diploma' | 'bachelor' | 'master' | 'doctorate';
    major: string;
    prevCert: string;
    prevInstitution: string;
    gradeType: 'percent' | 'gpa4' | 'gpa5';
    gradeValue: string | number;
    gradYear: string | number;
  };
  files: {
    photo?: { name: string; type: string; size: number; dataUrl: string };
    cert?: { name: string; type: string; size: number; dataUrl: string; pages?: number };
    idDoc?: { name: string; type: string; size: number; dataUrl: string };
    cv?: { name: string; type: string; size: number; dataUrl: string };
  };
  decision?: {
    at: string;
    by: string;
    reason: string;
  };
  generatedAccount?: {
    studentId: string;
    username: string;
    password: string;
    createdAt: string;
  };
}


