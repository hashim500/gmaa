import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  FileCheck2,
  HelpCircle,
  Bell,
  Award,
  Upload,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Play,
  Download,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  FileUp,
  MessageSquare,
  Sparkles,
  Image as ImageIcon,
  Check,
  X,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { User, Lecture, Assignment, Submission, Quiz, QuizResult, Announcement } from '../types';
import { storage } from '../services/storage';
import { VideoPlayerModal } from './VideoPlayerModal';
import { CollegeLogo } from './CollegeLogo';
import { PendingDeadlinesSection } from './PendingDeadlinesSection';

interface StudentPortalProps {
  student: User;
  onNavigate: (view: string) => void;
  onOpenLecture?: (lec: Lecture) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ student, onNavigate, onOpenLecture }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'lectures' | 'assignments' | 'quizzes' | 'announcements'>('courses');
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Selected lecture for player modal
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  // Upload assignment modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [solutionType, setSolutionType] = useState<'document' | 'image' | 'video'>('document');
  const [solutionNotes, setSolutionNotes] = useState('');
  const [solutionFileName, setSolutionFileName] = useState('');
  const [solutionMediaUrl, setSolutionMediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Active quiz taking state (supports up to 50 questions)
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizCompletedResult, setQuizCompletedResult] = useState<QuizResult | null>(null);
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  // Enlarged Image modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const loadData = () => {
    setLectures(storage.getLectures());
    setAssignments(storage.getAssignments());
    setSubmissions(storage.getStudentSubmissions(student.studentId || 'NSAC-2023-104'));
    setQuizzes(storage.getQuizzes());
    setQuizResults(storage.getStudentQuizResults(student.studentId || 'NSAC-2023-104'));
    setAnnouncements(storage.getAnnouncements());
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('nsac_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('nsac_storage_updated', handleStorageUpdate);
  }, [student]);

  // Count of assignments due within next 48 hours
  const urgentDeadlinesCount = assignments.filter((asg) => {
    let dueTime = 0;
    if (asg.dueDate.includes(' ')) {
      const [d, t] = asg.dueDate.split(' ');
      dueTime = new Date(`${d}T${t}:00`).getTime();
    } else if (asg.dueDate.length === 10) {
      dueTime = new Date(`${asg.dueDate}T23:59:59`).getTime();
    } else {
      dueTime = new Date(asg.dueDate).getTime();
    }
    const diffHours = (dueTime - Date.now()) / (1000 * 3600);
    return diffHours > 0 && diffHours <= 48;
  }).length;

  const handleOpenUpload = (asg: Assignment) => {
    setSelectedAssignment(asg);
    setSolutionNotes('');
    setSolutionType('document');
    setSolutionFileName(`حل_${asg.title.slice(0, 20)}_${student.name.split(' ')[0]}.pdf`);
    setSolutionMediaUrl('');
    setSubmitSuccess(false);
    setUploadModalOpen(true);
  };

  const handleSolutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setIsSubmitting(true);

    setTimeout(() => {
      storage.addSubmission({
        assignmentId: selectedAssignment.id,
        assignmentTitle: selectedAssignment.title,
        course: selectedAssignment.course,
        studentId: student.studentId || 'NSAC-2023-104',
        studentName: student.name,
        notes: solutionNotes || 'تم رفع إجابة وحل الواجب المحاسبي وفق الشروط الأكاديمية.',
        fileName: solutionType === 'document' ? solutionFileName : solutionType === 'image' ? 'دفتر_القيود_المحاسبية.png' : 'شرح_فيديو_المعالجة.mp4',
        fileSize: solutionType === 'video' ? '18.4 ميجابايت' : solutionType === 'image' ? '2.1 ميجابايت' : '1.4 ميجابايت',
        fileType: solutionType,
        mediaUrl: solutionMediaUrl || (solutionType === 'image' ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80' : undefined),
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setUploadModalOpen(false);
        setSubmitSuccess(false);
      }, 1200);
    }, 500);
  };

  // Start taking a quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setActiveQuestionIndex(0);
    setQuizAnswers({});
    setQuizCompletedResult(null);
    setShowDetailedReview(false);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    
    // Check if some questions unanswered
    const totalQCount = activeQuiz.questions.length;
    const answeredCount = Object.keys(quizAnswers).length;
    if (answeredCount < totalQCount) {
      if (!confirm(`لقد قمت بالإجابة على ${answeredCount} من أصل ${totalQCount} سؤالاً. هل تود بالتأكيد تسليم الاختبار الآن؟`)) {
        return;
      }
    }

    let earnedPoints = 0;
    let totalPoints = 0;

    activeQuiz.questions.forEach((q) => {
      totalPoints += q.points || 2;
      if (quizAnswers[q.id] === q.correctOption) {
        earnedPoints += q.points || 2;
      }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const result = storage.saveQuizResult({
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      studentId: student.studentId || 'NSAC-2023-104',
      studentName: student.name,
      score: earnedPoints,
      totalScore: totalPoints,
      percentage,
      answers: quizAnswers,
    });

    setQuizCompletedResult(result);
    setShowDetailedReview(true);
  };

  // Find submission for assignment
  const getSubmissionForAssignment = (asgId: string) => {
    return submissions.find((s) => s.assignmentId === asgId);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Student Welcome Header Card */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#133e68] to-[#06182c] text-white p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-[#c59b6d]/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-[#c59b6d] text-amber-300 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-inner">
              {student.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  بوابة الطالب الإلكترونية
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  حالة القيد: منتظم
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{student.name}</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                الرقم الجامعي: <span className="font-mono font-bold text-amber-300">{student.studentId}</span> | {student.department} | {student.level}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => onNavigate('transcript')}
              className="bg-[#c59b6d] hover:bg-[#b2834c] text-[#0b2545] px-4 py-2.5 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> كشف الدرجات
            </button>
            <button
              onClick={() => onNavigate('library')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold backdrop-blur transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-300" /> المكتبة الرقمية
            </button>
            <button
              onClick={() => onNavigate('schedule')}
              className="bg-[#0b2545] hover:bg-[#133e68] border border-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-300" /> الجدول
            </button>
            <button
              onClick={() => onNavigate('certificates')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold backdrop-blur transition flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-400" /> طلب شهادة
            </button>
            <button
              onClick={() => onNavigate('fees')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" /> سداد الرسوم
            </button>
          </div>
        </div>
      </div>

      {/* Quick Summary Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">المقررات المسجلة</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">6 مقررات</span>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">18 ساعة معتمدة</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">الواجبات والتكاليف</span>
          <span className="text-xl font-black text-amber-600 mt-1 block">{assignments.length} واجبات</span>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-[10px] text-emerald-600 font-bold">
              {submissions.length} تم تسليمها
            </span>
            {urgentDeadlinesCount > 0 && (
              <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full animate-pulse">
                {urgentDeadlinesCount} خلال 48 س
              </span>
            )}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">الاختبارات الإلكترونية</span>
          <span className="text-xl font-black text-purple-600 mt-1 block">{quizzes.length} متاح</span>
          <span className="text-[10px] text-purple-600 font-semibold mt-0.5 block">
            {quizResults.length} تم إنجازها
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">المعدل التراكمي (GPA)</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">3.88 / 4.00</span>
          <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">تقدير ممتاز (مرتبة الشرف)</span>
        </div>
      </div>

      {/* PENDING DEADLINES SECTION (HIGHLIGHTS ASSIGNMENTS DUE WITHIN 48 HOURS) */}
      <PendingDeadlinesSection
        assignments={assignments}
        submissions={submissions}
        studentId={student.studentId || 'NSAC-2023-104'}
        onOpenUpload={handleOpenUpload}
        onViewAllAssignments={() => setActiveTab('assignments')}
      />

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'courses'
              ? 'bg-[#0b2545] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> مقرراتي الدراسية
        </button>

        <button
          onClick={() => setActiveTab('lectures')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'lectures'
              ? 'bg-[#0b2545] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4 text-red-500" /> المحاضرات وقاعة البث ({lectures.length})
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap relative ${
            activeTab === 'assignments'
              ? 'bg-[#0b2545] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-amber-500" />
          <span>الواجبات والتكاليف المطورة ({assignments.length})</span>
          {urgentDeadlinesCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
              {urgentDeadlinesCount} عاجل
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'quizzes'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-500" /> الاختبارات الإلكترونية (Quizzes) ({quizzes.length})
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-500" /> لوحة الإعلانات الجامعية ({announcements.length})
        </button>
      </div>

      {/* TAB 1: COURSES */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              code: 'ACT-301',
              name: 'المحاسبة في بيئة التجارة الإلكترونية',
              doctor: 'د. عبد الله النور',
              progress: 75,
              hours: '3 ساعات',
            },
            {
              code: 'ACT-302',
              name: 'نظم المعلومات المحاسبية (AIS)',
              doctor: 'د. مريم الصادق',
              progress: 60,
              hours: '3 ساعات',
            },
            {
              code: 'ACT-303',
              name: 'المعايير الدولية لإعداد التقارير المالية (IFRS)',
              doctor: 'د. عثمان البشير',
              progress: 85,
              hours: '3 ساعات',
            },
            {
              code: 'ACT-304',
              name: 'المراجعة والتدقيق المالي الإلكتروني',
              doctor: 'د. إبراهيم فضل',
              progress: 40,
              hours: '3 ساعات',
            },
            {
              code: 'ACT-305',
              name: 'محاسبة التكاليف والمحاسبة الإدارية',
              doctor: 'د. سارة التاج',
              progress: 90,
              hours: '3 ساعات',
            },
            {
              code: 'ACT-306',
              name: 'التشريعات الضريبية والزكاة بالسودان',
              doctor: 'د. كمال الطيب',
              progress: 50,
              hours: '3 ساعات',
            },
          ].map((course, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  {course.code}
                </span>
                <span className="text-xs text-slate-500">{course.hours}</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 leading-snug">{course.name}</h4>
              <p className="text-xs text-slate-500">أستاذ المادة: {course.doctor}</p>
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-[11px] text-slate-600 font-bold">
                  <span>نسبة الإنجاز في المقرر</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LECTURES */}
      {activeTab === 'lectures' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-600" /> قاعة المحاضرات الإلكترونية والمحاضرات المسجلة
                </h3>
                <p className="text-xs text-slate-500">
                  شاهد المحاضرات الأكاديمية المصورة عبر مشغل الفيديو المدمج مع المواد الإثرائية
                </p>
              </div>
              <a
                href="https://www.youtube.com/@drama7sd"
                target="_blank"
                rel="noreferrer"
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> قناة الكلية الرسمية (@drama7sd)
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {lectures.map((lec) => (
                <div
                  key={lec.id}
                  className="bg-slate-50 hover:bg-slate-100/80 p-5 rounded-2xl border border-slate-200 transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                        {lec.course}
                      </span>
                      {lec.isLive ? (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span> بث مباشر
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lec.duration}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{lec.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{lec.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {lec.instructor} • {lec.date}
                    </span>
                    <button
                      onClick={() => setSelectedLecture(lec)}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> تشغيل المحاضرة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS & UPLOAD (ENHANCED MULTI-FORMAT) */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-amber-600" /> الواجبات الأكاديمية والتسليم المطور
                </h3>
                <p className="text-xs text-slate-500">
                  استعرض شروحات وصور الواجبات المطروحة مع إمكانية تسليم الحل (نص، صورة، فيديو، أو مستند) ومتابعة تقييم وملاحظات المعلم
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((asg) => {
                const sub = getSubmissionForAssignment(asg.id);
                return (
                  <div
                    key={asg.id}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md">
                          {asg.course}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                            الدرجة: {asg.maxScore}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            asg.type === 'video' ? 'bg-red-100 text-red-700' :
                            asg.type === 'image' ? 'bg-amber-100 text-amber-800' :
                            asg.type === 'file' ? 'bg-purple-100 text-purple-700' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {asg.type === 'video' ? 'فيديو للشرح' :
                             asg.type === 'image' ? 'صورة توضيحية' :
                             asg.type === 'file' ? 'ملف مرفق' : 'نص للواجب'}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">{asg.title}</h4>
                      <p className="text-xs text-slate-600">{asg.description}</p>

                      {/* Direct Media Preview if Provided by Instructor */}
                      {asg.type === 'image' && asg.mediaUrl && (
                        <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-black/5 max-h-40 group cursor-pointer"
                             onClick={() => setPreviewImage(asg.mediaUrl!)}>
                          <img
                            src={asg.mediaUrl}
                            alt="صورة الواجب"
                            className="w-full h-36 object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 text-white flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition text-xs font-bold">
                            <Eye className="w-4 h-4" /> انقر لتكبير صورة التمرين المحاسبي
                          </div>
                        </div>
                      )}

                      {asg.type === 'video' && asg.mediaUrl && (
                        <a
                          href={asg.mediaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-red-50 hover:bg-red-100 p-2.5 rounded-xl border border-red-200 text-xs text-red-900 flex items-center justify-between transition"
                        >
                          <span className="flex items-center gap-1.5 font-bold">
                            <Video className="w-4 h-4 text-red-600" /> مشاهدة فيديو الشرح الأكاديمي للواجب
                          </span>
                          <span className="text-[11px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                            فتح
                          </span>
                        </a>
                      )}

                      {asg.type === 'file' && (
                        <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold">
                            <FileText className="w-4 h-4 text-purple-600" /> {asg.fileName || 'كراسة_التمارين_الأكاديمية.pdf'}
                          </span>
                          <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded font-bold">
                            ملف التمرين
                          </span>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>آخر موعد: <strong>{asg.dueDate}</strong></span>
                        <span>• أستاذ المادة: {asg.instructor}</span>
                        {(() => {
                          let dueTime = 0;
                          if (asg.dueDate.includes(' ')) {
                            const [d, t] = asg.dueDate.split(' ');
                            dueTime = new Date(`${d}T${t}:00`).getTime();
                          } else if (asg.dueDate.length === 10) {
                            dueTime = new Date(`${asg.dueDate}T23:59:59`).getTime();
                          } else {
                            dueTime = new Date(asg.dueDate).getTime();
                          }
                          const diffH = (dueTime - Date.now()) / (1000 * 3600);
                          if (diffH > 0 && diffH <= 48) {
                            return (
                              <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-black px-2 py-0.5 rounded-md animate-pulse">
                                ⏳ متبقي {Math.floor(diffH)} ساعة (موعد نهائي عاجل)
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>

                    {/* Submission Status & Feedback */}
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      {sub ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            {sub.status === 'graded' ? (
                              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                تم الرصد: {sub.score} من {asg.maxScore} درجة
                              </span>
                            ) : (
                              <span className="bg-blue-100 text-blue-900 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                تم التسليم (بانتظار رصد الدرجة)
                              </span>
                            )}

                            <button
                              onClick={() => handleOpenUpload(asg)}
                              className="text-xs text-blue-700 font-bold hover:underline"
                            >
                              إعادة التسليم
                            </button>
                          </div>

                          {sub.feedback && (
                            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-0.5">
                              <span className="font-bold block">ملاحظات وتقييم أستاذ المقرر:</span>
                              <p className="italic leading-relaxed">{sub.feedback}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> مطلوب التسليم
                          </span>
                          <button
                            onClick={() => handleOpenUpload(asg)}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" /> رفع الحل الآن
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADVANCED INTERACTIVE QUIZZES (UP TO 50 QUESTIONS) */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          {activeQuiz ? (
            /* Active Quiz Interface */
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                      {activeQuiz.course}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                      {activeQuiz.questions.length} سؤالاً
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">{activeQuiz.title}</h3>
                  <p className="text-xs text-slate-500">
                    المدة: {activeQuiz.durationMinutes} دقيقة | إجمالي الدرجات: {activeQuiz.totalScore} درجة
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (confirm('هل تريد إلغاء الاختبار والعودة للقائمة؟ لن يتم حفظ إجاباتك غير المكتملة.')) {
                      setActiveQuiz(null);
                      setQuizCompletedResult(null);
                    }
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  إلغاء والعودة
                </button>
              </div>

              {quizCompletedResult ? (
                /* Completed Result Screen with Automated Detailed Grading & Review */
                <div className="space-y-6">
                  <div className="text-center py-8 bg-gradient-to-b from-emerald-50 to-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 space-y-3">
                    <div className="w-16 h-16 bg-emerald-600 text-white rounded-full mx-auto flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900">
                      تم التصحيح الفوري الآلي بنجاح!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      نتيجة الطالب: <strong className="text-slate-900">{student.name}</strong> في اختبار: {activeQuiz.title}
                    </p>

                    <div className="py-2">
                      <div className="text-4xl sm:text-5xl font-black text-emerald-700">
                        {quizCompletedResult.score} / {quizCompletedResult.totalScore}
                      </div>
                      <span className="text-base sm:text-lg font-bold text-slate-700 block mt-1">
                        النسبة المئوية: <strong className="text-emerald-700">{quizCompletedResult.percentage}%</strong>
                      </span>
                      <span className="inline-block mt-2 px-4 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {quizCompletedResult.percentage >= 90
                          ? 'التقدير: ممتاز مرتفع (A+)'
                          : quizCompletedResult.percentage >= 80
                          ? 'التقدير: جيد جداً (B+)'
                          : quizCompletedResult.percentage >= 65
                          ? 'التقدير: جيد (C)'
                          : 'التقدير: يحتاج إلى مراجعة إضافية'}
                      </span>
                    </div>

                    <div className="flex justify-center gap-3 pt-3">
                      <button
                        onClick={() => handleStartQuiz(activeQuiz)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" /> إعادة المحاولة
                      </button>
                      <button
                        onClick={() => {
                          setActiveQuiz(null);
                          setQuizCompletedResult(null);
                        }}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md"
                      >
                        العودة لقائمة الاختبارات
                      </button>
                    </div>
                  </div>

                  {/* Detailed Question-by-Question Review (Correct vs Incorrect Model Answers) */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          المراجعة الأكاديمية الشاملة للإجابات النموذجية
                        </h4>
                        <p className="text-xs text-slate-500">
                          راجع إجاباتك مع توضيح الإجابات الصحيحة والخاطئة ونموذج الحل المعتمد
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {activeQuiz.questions.map((q, idx) => {
                        const studentChoice = quizAnswers[q.id];
                        const isCorrect = studentChoice === q.correctOption;
                        return (
                          <div
                            key={q.id}
                            className={`p-5 rounded-2xl border transition ${
                              isCorrect
                                ? 'bg-emerald-50/40 border-emerald-200'
                                : 'bg-rose-50/40 border-rose-200'
                            } space-y-3 text-xs`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-500">
                                السؤال {idx + 1} من {activeQuiz.questions.length}
                              </span>
                              {isCorrect ? (
                                <span className="bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> إجابة صحيحة (+{q.points || 2} درجات)
                                </span>
                              ) : (
                                <span className="bg-rose-600 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1">
                                  <X className="w-3.5 h-3.5" /> إجابة غير صحيحة (0 درجة)
                                </span>
                              )}
                            </div>

                            <h5 className="font-black text-sm text-slate-900 leading-relaxed">
                              {q.text}
                            </h5>

                            {/* Options with Highlights */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {q.options.map((opt, optIdx) => {
                                const wasSelected = studentChoice === optIdx;
                                const isModelAnswer = q.correctOption === optIdx;
                                return (
                                  <div
                                    key={optIdx}
                                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                                      isModelAnswer
                                        ? 'bg-emerald-100/90 border-emerald-500 text-emerald-950 font-bold'
                                        : wasSelected && !isCorrect
                                        ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
                                        : 'bg-white border-slate-200 text-slate-600'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {isModelAnswer && (
                                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                                        الإجابة النموذجية الصحيحة ✓
                                      </span>
                                    )}
                                    {wasSelected && !isCorrect && (
                                      <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                                        إجابتك المسجلة ✕
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive Quiz Answering Mode (Supports 50 Questions with Grid Navigator) */
                <div className="space-y-6">
                  {/* Question Grid Bar */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>فهرس الأسئلة (انقر للانتقال لأي سؤال مباشرة):</span>
                      <span className="font-mono text-blue-700">
                        تمت الإجابة: {Object.keys(quizAnswers).length} / {activeQuiz.questions.length}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 custom-scrollbar">
                      {activeQuiz.questions.map((q, idx) => {
                        const isAnswered = quizAnswers[q.id] !== undefined;
                        const isCurrent = activeQuestionIndex === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveQuestionIndex(idx)}
                            className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition ${
                              isCurrent
                                ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                                : isAnswered
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-black'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Single Question Focused View */}
                  {activeQuiz.questions[activeQuestionIndex] && (
                    <div className="p-6 bg-slate-50 rounded-2xl border-2 border-blue-500/30 space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-600 border-b border-slate-200 pb-2">
                        <span className="bg-blue-100 text-blue-900 px-3 py-0.5 rounded-full font-black">
                          السؤال رقم {activeQuestionIndex + 1} من {activeQuiz.questions.length}
                        </span>
                        <span className="text-slate-500">
                          {activeQuiz.questions[activeQuestionIndex].points || 2} درجات
                        </span>
                      </div>

                      <h4 className="font-black text-base text-slate-900 leading-relaxed">
                        {activeQuiz.questions[activeQuestionIndex].text}
                      </h4>

                      <div className="space-y-2.5 pt-2">
                        {activeQuiz.questions[activeQuestionIndex].options.map((opt, optIdx) => {
                          const isSelected = quizAnswers[activeQuiz.questions[activeQuestionIndex].id] === optIdx;
                          return (
                            <label
                              key={optIdx}
                              onClick={() => handleAnswerSelect(activeQuiz.questions[activeQuestionIndex].id, optIdx)}
                              className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer text-xs font-bold transition ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q_${activeQuiz.questions[activeQuestionIndex].id}`}
                                checked={isSelected}
                                onChange={() => handleAnswerSelect(activeQuiz.questions[activeQuestionIndex].id, optIdx)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm">{opt}</span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Navigation Prev / Next */}
                      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                        <button
                          type="button"
                          disabled={activeQuestionIndex === 0}
                          onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                          className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs disabled:opacity-30 flex items-center gap-1.5 transition"
                        >
                          <ChevronRight className="w-4 h-4" /> السؤال السابق
                        </button>

                        <span className="text-xs font-mono font-bold text-slate-500">
                          {activeQuestionIndex + 1} / {activeQuiz.questions.length}
                        </span>

                        <button
                          type="button"
                          disabled={activeQuestionIndex === activeQuiz.questions.length - 1}
                          onClick={() => setActiveQuestionIndex((prev) => Math.min(activeQuiz.questions.length - 1, prev + 1))}
                          className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs disabled:opacity-30 flex items-center gap-1.5 transition"
                        >
                          السؤال التالي <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Finish Quiz Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleSubmitQuiz}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl text-sm shadow-md transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      تأكيد إرسال الإجابات والتصحيح التلقائي الفوري
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quizzes List */
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" /> الاختبارات الإلكترونية المتاحة (Quizzes)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((quiz) => {
                  const priorResult = quizResults.find((r) => r.quizId === quiz.id);
                  return (
                    <div
                      key={quiz.id}
                      className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          {quiz.course}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{quiz.title}</h4>
                        <p className="text-xs text-slate-500">
                          عدد الأسئلة: {quiz.questions.length} سؤالاً • المدة: {quiz.durationMinutes} دقيقة • الدرجة الكلية: {quiz.totalScore}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                        {priorResult ? (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                            أتممت الاختبار: {priorResult.score} / {priorResult.totalScore} ({priorResult.percentage}%)
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            متاح الآن للبدء
                          </span>
                        )}

                        <button
                          onClick={() => handleStartQuiz(quiz)}
                          className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
                        >
                          {priorResult ? 'إعادة الاختبار' : 'بدء الاختبار الآن'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-700" /> لوحة الإعلانات الجامعية وجداول الامتحانات
            </h3>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-5 rounded-2xl border ${
                    ann.isUrgent
                      ? 'bg-red-50/60 border-red-200'
                      : 'bg-slate-50 border-slate-200'
                  } space-y-2`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-800 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                      {ann.department}
                    </span>
                    <span className="text-[11px] text-slate-500">{ann.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    {ann.isUrgent && (
                      <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        عاجل وهام
                      </span>
                    )}
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      <VideoPlayerModal
        lecture={selectedLecture}
        isOpen={Boolean(selectedLecture)}
        onClose={() => setSelectedLecture(null)}
      />

      {/* Enlarged Image Viewer */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2">
            <img src={previewImage} alt="عرض مكبر" className="w-full h-auto max-h-[80vh] object-contain" />
            <p className="text-center text-xs text-slate-600 p-2 font-bold">انقر في أي مكان للإغلاق</p>
          </div>
        </div>
      )}

      {/* Upload Assignment Solution Modal (Multi-format) */}
      {uploadModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-6">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {selectedAssignment.course}
              </span>
              <h3 className="font-black text-lg text-slate-900 mt-1">
                تسليم حل: {selectedAssignment.title}
              </h3>
              <p className="text-xs text-slate-500">
                الموعد النهائي: {selectedAssignment.dueDate} | الدرجة القصوى: {selectedAssignment.maxScore} درجة
              </p>
            </div>

            {submitSuccess ? (
              <div className="text-center py-6 space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">تم تسليم الحل للأستاذ بنجاح!</h4>
                <p className="text-xs text-emerald-700">ستصلك التغذية الراجعة فور رصد الدرجة من قِبل أستاذ المقرر.</p>
              </div>
            ) : (
              <form onSubmit={handleSolutionSubmit} className="space-y-4 text-xs">
                {/* Format selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">حدد طريقة ونوع تسليم الحل:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSolutionType('document')}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        solutionType === 'document'
                          ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>مستند (PDF / Excel)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSolutionType('image')}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        solutionType === 'image'
                          ? 'bg-amber-50 border-amber-600 text-amber-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 text-amber-600" />
                      <span>صورة للدفتر</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSolutionType('video')}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        solutionType === 'video'
                          ? 'bg-red-50 border-red-600 text-red-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Video className="w-4 h-4 text-red-600" />
                      <span>مقطع فيديو للشرح</span>
                    </button>
                  </div>
                </div>

                {/* If Document */}
                {solutionType === 'document' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ملف المستند المرفق</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50">
                      <Upload className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                      <input
                        type="file"
                        id="asg-file-upload"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSolutionFileName(e.target.files[0].name);
                          }
                        }}
                      />
                      <label
                        htmlFor="asg-file-upload"
                        className="cursor-pointer bg-blue-700 hover:bg-blue-800 text-white font-bold px-3.5 py-1.5 rounded-xl inline-block"
                      >
                        اختيار ملف من جهازك
                      </label>
                      <p className="text-[11px] text-slate-500 mt-1 font-mono">
                        الملف المختار: <strong className="text-blue-900">{solutionFileName}</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* If Image with instant preview */}
                {solutionType === 'image' && (
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700">صورة دفتر اليومية أو الحل اليدوي</label>
                    <div className="border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center bg-amber-50/50 space-y-2">
                      <ImageIcon className="w-6 h-6 text-amber-600 mx-auto" />
                      <input
                        type="file"
                        accept="image/*"
                        id="asg-img-upload"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setSolutionMediaUrl(event.target.result as string);
                              }
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                      />
                      <label
                        htmlFor="asg-img-upload"
                        className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl inline-block"
                      >
                        التقاط أو رفع صورة الحل
                      </label>

                      {solutionMediaUrl ? (
                        <div className="mt-2 border rounded-xl overflow-hidden max-h-36 bg-white">
                          <img src={solutionMediaUrl} alt="معاينة الحل" className="w-full h-32 object-cover" />
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500">
                          سيتم استعراض الصورة للأستاذ بدقة عالية لتدقيق الأرقام والقيود
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* If Video */}
                {solutionType === 'video' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رابط فيديو الشرح أو التسجيل</label>
                    <input
                      type="url"
                      placeholder="https://... رابط الفيديو المسجل لشرح خطوات الحل"
                      value={solutionMediaUrl}
                      onChange={(e) => setSolutionMediaUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono dir-ltr text-left"
                    />
                  </div>
                )}

                {/* Solution Notes */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ملاحظات وشروحات القيود المحاسبية للأستاذ:
                  </label>
                  <textarea
                    rows={3}
                    value={solutionNotes}
                    onChange={(e) => setSolutionNotes(e.target.value)}
                    placeholder="اكتب أي توضيحات خاصة بالحل أو المبررات المحاسبية..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> تأكيد التسليم النهائي
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
