import React, { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  FileText,
  CheckCircle2,
  Users,
  GraduationCap,
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
  Edit,
  Save,
  MessageSquare,
  HelpCircle,
  Play,
  UploadCloud,
  FileCheck2,
  Sparkles,
  Search,
  Image as ImageIcon,
  FileCode,
  BookOpen,
  Eye,
  Check,
  X,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { User, Lecture, Assignment, Submission, Quiz, QuizQuestion } from '../types';
import { storage, extractYouTubeVideoId } from '../services/storage';
import { ACCOUNTING_QUESTION_BANK } from '../services/questionBank';
import { VideoPlayerModal } from './VideoPlayerModal';
import { CollegeLogo } from './CollegeLogo';

interface InstructorDashboardProps {
  instructor: User;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ instructor }) => {
  const [activeTab, setActiveTab] = useState<'lectures' | 'grading' | 'assignments' | 'quizzes'>('grading');
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Preview lecture modal
  const [previewLecture, setPreviewLecture] = useState<Lecture | null>(null);

  // Add Lecture Modal State
  const [addLectureModalOpen, setAddLectureModalOpen] = useState(false);
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureCourse, setLectureCourse] = useState('المحاسبة في بيئة التجارة الإلكترونية');
  const [lectureYoutubeUrl, setLectureYoutubeUrl] = useState('https://www.youtube.com/watch?v=M7lc1UVf-VE');
  const [lectureDate, setLectureDate] = useState('2026-09-24');
  const [lectureTime, setLectureTime] = useState('04:00 مساءً');
  const [lectureDuration, setLectureDuration] = useState('50 دقيقة');
  const [lectureDescription, setLectureDescription] = useState('');
  const [lectureIsLive, setLectureIsLive] = useState(false);

  // Add Assignment Modal State
  const [addAssignmentModalOpen, setAddAssignmentModalOpen] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgCourse, setAsgCourse] = useState('المحاسبة في بيئة التجارة الإلكترونية');
  const [asgDueDate, setAsgDueDate] = useState('2026-10-15');
  const [asgMaxScore, setAsgMaxScore] = useState(20);
  const [asgDescription, setAsgDescription] = useState('');
  const [asgInstructions, setAsgInstructions] = useState('');
  const [asgType, setAsgType] = useState<'text' | 'video' | 'image' | 'file'>('text');
  const [asgMediaUrl, setAsgMediaUrl] = useState('');
  const [asgFileName, setAsgFileName] = useState('');

  // Grading Modal State
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(18);
  const [gradingFeedback, setGradingFeedback] = useState('');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // Advanced Quiz Creator Modal State (Up to 50 Questions!)
  const [addQuizModalOpen, setAddQuizModalOpen] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCourse, setQuizCourse] = useState('المحاسبة في بيئة التجارة الإلكترونية');
  const [quizDuration, setQuizDuration] = useState(30);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-init-1',
      text: 'ما هو المبدأ المحاسبي الذي يقضي بالاعتراف بالإيرادات عند تحققها ونقل المنافع للعميل؟',
      options: [
        'مبدأ التكلفة التاريخية',
        'مبدأ الاعتراف بالإيراد (Revenue Recognition)',
        'مبدأ الحيطة والحذر',
        'مبدأ الإفصاح التام',
      ],
      correctOption: 1,
      points: 2,
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const loadData = () => {
    setLectures(storage.getLectures());
    setAssignments(storage.getAssignments());
    setSubmissions(storage.getSubmissions());
    setQuizzes(storage.getQuizzes());
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('nsac_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('nsac_storage_updated', handleStorageUpdate);
  }, []);

  // Save new Lecture
  const handleCreateLecture = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addLecture({
      title: lectureTitle,
      course: lectureCourse,
      instructor: instructor.name,
      youtubeUrl: lectureYoutubeUrl,
      videoId: extractYouTubeVideoId(lectureYoutubeUrl),
      date: lectureDate,
      time: lectureTime,
      duration: lectureDuration,
      description: lectureDescription || 'شرح عملي وتطبيقي للوحدة الدراسية وفق معايير المحاسبة المعتمدة.',
      isLive: lectureIsLive,
      resources: [
        { name: `مذكرة_${lectureTitle.slice(0, 15)}.pdf`, url: '#', size: '1.5 ميجابايت' },
      ],
    });
    setAddLectureModalOpen(false);
    setLectureTitle('');
    setLectureDescription('');
  };

  // Delete Lecture
  const handleDeleteLecture = (id: string) => {
    if (confirm('هل تريد بالتأكيد حذف هذه المحاضرة؟')) {
      storage.deleteLecture(id);
    }
  };

  // Save new Assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addAssignment({
      title: asgTitle,
      course: asgCourse,
      instructor: instructor.name,
      dueDate: asgDueDate,
      maxScore: Number(asgMaxScore) || 20,
      description: asgDescription,
      instructions: asgInstructions || 'يجب تسليم الحل بصيغة واضحة متضمنة خطوات القيود والتسويات المحاسبية.',
      type: asgType,
      mediaUrl: asgMediaUrl || (asgType === 'image' ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80' : undefined),
      fileName: asgFileName || (asgType === 'file' ? 'كراسة_التمارين_الأكاديمية.pdf' : undefined),
    });
    setAddAssignmentModalOpen(false);
    setAsgTitle('');
    setAsgDescription('');
    setAsgMediaUrl('');
    setAsgFileName('');
    setAsgType('text');
  };

  // Delete Assignment
  const handleDeleteAssignment = (id: string) => {
    if (confirm('هل تريد بالتأكيد حذف هذا الواجب؟ ستتم إزالة التكليف وحلول الطلاب المرتبطة به.')) {
      storage.deleteAssignment(id);
    }
  };

  // Open Grading Modal
  const handleOpenGrading = (sub: Submission) => {
    setSelectedSubmission(sub);
    setGradingScore(sub.score || 18);
    setGradingFeedback(sub.feedback || 'أحسنت، إجابة متقنة ومطابقة لمعايير المحاسبة والقيود السليمة.');
    setGradingModalOpen(true);
  };

  // Submit Grade
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    storage.gradeSubmission(
      selectedSubmission.id,
      Number(gradingScore),
      gradingFeedback,
      instructor.name
    );
    setGradingModalOpen(false);
  };

  // Quick populate Quiz from Question Bank
  const handlePopulateBank = (count: 10 | 25 | 50) => {
    const selected = ACCOUNTING_QUESTION_BANK.slice(0, count).map((q, idx) => ({
      id: `q-bank-${Date.now()}-${idx + 1}`,
      text: q.text,
      options: [...q.options],
      correctOption: q.correctOption,
      points: 2,
    }));
    setQuizQuestions(selected);
    setCurrentQuestionIndex(0);
    setQuizDuration(count === 50 ? 60 : count === 25 ? 40 : 20);
    alert(`تم بنجاح توليد ${count} سؤالاً محاسبياً نموذجياً مع الإجابات المعتمدة وتوزيع الدرجات!`);
  };

  // Add individual question to quiz
  const handleAddBlankQuestion = () => {
    if (quizQuestions.length >= 50) {
      alert('الحد الأقصى للاختبار هو 50 سؤالاً');
      return;
    }
    const newQ: QuizQuestion = {
      id: `q-custom-${Date.now()}`,
      text: '',
      options: ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'],
      correctOption: 0,
      points: 2,
    };
    setQuizQuestions([...quizQuestions, newQ]);
    setCurrentQuestionIndex(quizQuestions.length);
  };

  // Remove question from quiz
  const handleRemoveQuestion = (idx: number) => {
    if (quizQuestions.length <= 1) {
      alert('يجب أن يحتوي الاختبار على سؤال واحد على الأقل');
      return;
    }
    const updated = quizQuestions.filter((_, i) => i !== idx);
    setQuizQuestions(updated);
    setCurrentQuestionIndex(Math.max(0, idx - 1));
  };

  // Update question field
  const updateCurrentQuestion = (field: keyof QuizQuestion, value: any) => {
    const updated = [...quizQuestions];
    updated[currentQuestionIndex] = {
      ...updated[currentQuestionIndex],
      [field]: value,
    };
    setQuizQuestions(updated);
  };

  // Update question option text
  const updateCurrentOption = (optIdx: number, val: string) => {
    const updated = [...quizQuestions];
    const newOptions = [...updated[currentQuestionIndex].options];
    newOptions[optIdx] = val;
    updated[currentQuestionIndex].options = newOptions;
    setQuizQuestions(updated);
  };

  // Save Quiz
  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) {
      alert('يرجى كتابة عنوان الاختبار');
      return;
    }
    // Check if any question has empty text
    const emptyQ = quizQuestions.findIndex((q) => !q.text.trim());
    if (emptyQ !== -1) {
      alert(`يرجى كتابة نص السؤال رقم ${emptyQ + 1}`);
      setCurrentQuestionIndex(emptyQ);
      return;
    }

    const totalPts = quizQuestions.reduce((acc, q) => acc + (q.points || 1), 0);

    storage.addQuiz({
      title: quizTitle,
      course: quizCourse,
      durationMinutes: quizDuration,
      totalScore: totalPts,
      questions: quizQuestions,
    });

    setAddQuizModalOpen(false);
    setQuizTitle('');
    alert(`تم بنجاح حفظ ونشر الاختبار الإلكتروني (${quizQuestions.length} سؤالاً) للطلاب!`);
  };

  // Delete Quiz
  const handleDeleteQuiz = (id: string) => {
    if (confirm('هل تريد بالتأكيد حذف هذا الاختبار الإلكتروني؟')) {
      storage.deleteQuiz(id);
    }
  };

  const currentQ = quizQuestions[currentQuestionIndex] || quizQuestions[0];
  const totalQuizPoints = quizQuestions.reduce((acc, q) => acc + (q.points || 1), 0);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Instructor Welcome Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-inner">
              <GraduationCap className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  بوابة أعضاء هيئة التدريس
                </span>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  أستاذ معتمد
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{instructor.name}</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {instructor.department} • كلية السودان الجديد للمحاسبة
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setAddAssignmentModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> طرح واجب جديد
            </button>
            <button
              onClick={() => setAddQuizModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> إنشاء اختبار ذكي (حتى 50 سؤالاً)
            </button>
            <button
              onClick={() => setAddLectureModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2"
            >
              <Video className="w-4 h-4" /> جدولة محاضرة
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">المحاضرات المجدولة والمسجلة</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{lectures.length} محاضرة</span>
          <span className="text-[10px] text-blue-600 font-semibold block">متاحة بالقاعة الافتراضية</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">التكاليف والواجبات المطروحة</span>
          <span className="text-xl font-black text-amber-600 mt-1 block">{assignments.length} واجبات</span>
          <span className="text-[10px] text-slate-500 block">شاملة النصوص، الصور، والفيديو</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">إجابات الطلاب المستلمة</span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">{submissions.length} إجابة</span>
          <span className="text-[10px] text-emerald-600 font-bold block">
            {submissions.filter((s) => s.status === 'graded').length} تم رصد درجاتهم
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">الاختبارات الإلكترونية النشطة</span>
          <span className="text-xl font-black text-purple-600 mt-1 block">{quizzes.length} اختبار</span>
          <span className="text-[10px] text-purple-600 font-semibold block">تصحيح فوري آلي</span>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setActiveTab('grading')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'grading'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-amber-500" /> مراجعة وتصحيح حلول الطلاب ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'assignments'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-500" /> بنك الواجبات والتكاليف ({assignments.length})
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'quizzes'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-500" /> الاختبارات الإلكترونية (Quizzes) ({quizzes.length})
        </button>

        <button
          onClick={() => setActiveTab('lectures')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'lectures'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4 text-red-500" /> المحاضرات وقاعة البث ({lectures.length})
        </button>
      </div>

      {/* TAB 1: GRADING & REVIEWING SUBMISSIONS */}
      {activeTab === 'grading' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-600" /> مراجعة وتقييم حلول الطلاب مع رصد الدرجة والتغذية الراجعة
              </h3>
              <p className="text-xs text-slate-500">
                استعرض إجابات الطلاب (نصوص، صور مرفوعة، فيديوهات، أو مستندات)، ثم امنح الدرجة المستحقة واكتب التغذية الراجعة المباشرة
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3.5 font-bold">اسم الطالب والرقم الجامعي</th>
                  <th className="p-3.5 font-bold">الواجب والمقرر</th>
                  <th className="p-3.5 font-bold">نوع الملف وحل الطالب</th>
                  <th className="p-3.5 font-bold">وقت التسليم</th>
                  <th className="p-3.5 font-bold">حالة التقييم والدرجة</th>
                  <th className="p-3.5 font-bold text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{sub.studentName}</span>
                      <span className="font-mono text-[11px] text-blue-700 block">{sub.studentId}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 block">{sub.assignmentTitle}</span>
                      <span className="text-[10px] text-slate-500 block">{sub.course}</span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-blue-700 mb-1">
                        {sub.fileType === 'image' ? (
                          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                        ) : sub.fileType === 'video' ? (
                          <Video className="w-3.5 h-3.5 text-red-600" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        <span className="truncate">{sub.fileName || 'ملف الحل المرفق'}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                        "{sub.notes}"
                      </p>
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                      {sub.submissionDate}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {sub.status === 'graded' ? (
                        <div className="space-y-0.5">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> تم الرصد ({sub.score} درجة)
                          </span>
                          {sub.feedback && (
                            <p className="text-[10px] text-slate-500 max-w-xs truncate" title={sub.feedback}>
                              {sub.feedback}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                          بانتظار رصد الدرجة
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleOpenGrading(sub)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition shadow-xs ${
                          sub.status === 'graded'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {sub.status === 'graded' ? 'مراجعة / تعديل الدرجة' : 'معاينة الحل ورصد الدرجة'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ASSIGNMENTS MANAGEMENT */}
      {activeTab === 'assignments' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" /> إدارة وتكليف الواجبات الأكاديمية المطورة
              </h3>
              <p className="text-xs text-slate-500">
                طرح تكليفات متنوعة (نص، مقطع فيديو تعليمي، صورة توضيحية مباشرة، أو إرفاق ملف مستند)
              </p>
            </div>
            <button
              onClick={() => setAddAssignmentModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> إنشاء واجب متعدد الوسائط
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => {
              const asgSubmissions = submissions.filter((s) => s.assignmentId === asg.id);
              return (
                <div
                  key={asg.id}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-4 space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md">
                        {asg.course}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {asg.maxScore} درجة
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          asg.type === 'video' ? 'bg-red-100 text-red-700' :
                          asg.type === 'image' ? 'bg-amber-100 text-amber-800' :
                          asg.type === 'file' ? 'bg-purple-100 text-purple-700' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {asg.type === 'video' ? 'فيديو توضيحي' :
                           asg.type === 'image' ? 'صورة توضيحية' :
                           asg.type === 'file' ? 'ملف مرفق' : 'نص فقط'}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{asg.title}</h4>
                    <p className="text-xs text-slate-600">{asg.description}</p>

                    {/* Preview of Image or Video if present */}
                    {asg.type === 'image' && asg.mediaUrl && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-300 max-h-40 bg-slate-100">
                        <img
                          src={asg.mediaUrl}
                          alt="صورة الواجب"
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-md">
                          صورة توضيحية مباشرة للواجب
                        </div>
                      </div>
                    )}

                    {asg.type === 'video' && asg.mediaUrl && (
                      <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-xs text-red-900 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="font-semibold truncate max-w-xs">{asg.mediaUrl}</span>
                        </div>
                        <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                          فيديو الشرح
                        </span>
                      </div>
                    )}

                    {asg.type === 'file' && (
                      <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="font-bold">{asg.fileName || 'ملف_التكليف_المعتمد.pdf'}</span>
                      </div>
                    )}

                    <div className="text-[11px] text-amber-800 font-semibold bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
                      الموعد النهائي: {asg.dueDate} • تم تسليم {asgSubmissions.length} حلول حتى الآن
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <button
                      onClick={() => setActiveTab('grading')}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" /> استعراض حلول الطلاب ({asgSubmissions.length})
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(asg.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition"
                      title="حذف الواجب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: QUIZZES MANAGEMENT */}
      {activeTab === 'quizzes' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" /> إدارة الاختبارات الإلكترونية المتقدمة (Quizzes)
              </h3>
              <p className="text-xs text-slate-500">
                إنشاء وتخصيص اختبارات حتى 50 سؤالاً مع تحديد الإجابات النموذجية والتصحيح التلقائي الفوري
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAddQuizModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> إنشاء اختبار إلكتروني جديد
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {quiz.course}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      المدة: {quiz.durationMinutes} دقيقة
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{quiz.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-bold text-blue-700">
                      عدد الأسئلة: {quiz.questions.length} سؤالاً
                    </span>
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-bold text-emerald-700">
                      مجموع الدرجات: {quiz.totalScore} درجة
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-700 block">عينة من أسئلة الاختبار:</span>
                    <p className="text-slate-600 line-clamp-1">{quiz.questions[0]?.text}</p>
                    <span className="text-[10px] text-emerald-700 block font-semibold">
                      ✓ الإجابة المعتمدة مسبقاً: {quiz.questions[0]?.options[quiz.questions[0]?.correctOption]}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    تاريخ الإنشاء: {quiz.createdAt}
                  </span>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition"
                    title="حذف الاختبار"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LECTURES & YOUTUBE MANAGEMENT */}
      {activeTab === 'lectures' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-red-600" /> إدارة وبث المحاضرات الأونلاين (يوتيوب والبث الحي)
              </h3>
              <p className="text-xs text-slate-500">
                يمكنك ربط المحاضرات بروابط يوتيوب (بما فيها القناة @drama7sd) وتحديد المواعيد لتبث للطلاب
              </p>
            </div>
            <button
              onClick={() => setAddLectureModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> إضافة محاضرة جديدة
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lectures.map((lec) => (
              <div
                key={lec.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md">
                      {lec.course}
                    </span>
                    {lec.isLive ? (
                      <span className="text-red-600 font-bold text-[11px] flex items-center gap-1 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span> بث مباشر نشط
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">{lec.duration}</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{lec.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{lec.description}</p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {lec.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {lec.time}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewLecture(lec)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" /> معاينة مشغل الفيديو
                  </button>

                  <button
                    onClick={() => handleDeleteLecture(lec.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition"
                    title="حذف المحاضرة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD LECTURE */}
      {addLectureModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-black text-lg text-slate-900">جدولة محاضرة فيديو أونلاين جديدة</h3>
            <form onSubmit={handleCreateLecture} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان المحاضرة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: المحاسبة في بيئة التجارة الإلكترونية - الفصل الخامس"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المقرر الدراسي</label>
                <select
                  value={lectureCourse}
                  onChange={(e) => setLectureCourse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                >
                  <option value="المحاسبة في بيئة التجارة الإلكترونية">المحاسبة في بيئة التجارة الإلكترونية</option>
                  <option value="نظم المعلومات المحاسبية (AIS)">نظم المعلومات المحاسبية (AIS)</option>
                  <option value="المعايير الدولية لإعداد التقارير (IFRS)">المعايير الدولية لإعداد التقارير (IFRS)</option>
                  <option value="المراجعة والتدقيق المالي">المراجعة والتدقيق المالي</option>
                  <option value="محاسبة التكاليف والمحاسبة الإدارية">محاسبة التكاليف والمحاسبة الإدارية</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رابط فيديو المحاضرة على يوتيوب (أو البث المباشر)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=... أو معرف القناة @drama7sd"
                  value={lectureYoutubeUrl}
                  onChange={(e) => setLectureYoutubeUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 text-left dir-ltr"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  يمكنك وضع أي رابط يوتيوب أو اختيار فيديوهات من قناة الكلية @drama7sd
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التاريخ</label>
                  <input
                    type="date"
                    required
                    value={lectureDate}
                    onChange={(e) => setLectureDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الوقت</label>
                  <input
                    type="text"
                    required
                    value={lectureTime}
                    onChange={(e) => setLectureTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المدة</label>
                  <input
                    type="text"
                    required
                    value={lectureDuration}
                    onChange={(e) => setLectureDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">وصف المحاضرة والمحاور</label>
                <textarea
                  rows={2}
                  placeholder="أدخل ملخصاً عن الموضوعات التي ستتم مناقشتها في هذه المحاضرة..."
                  value={lectureDescription}
                  onChange={(e) => setLectureDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-xl border border-red-200 text-red-900">
                <input
                  type="checkbox"
                  id="chk-live"
                  checked={lectureIsLive}
                  onChange={(e) => setLectureIsLive(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <label htmlFor="chk-live" className="font-bold cursor-pointer text-xs">
                  تعيين هذه المحاضرة كبث مباشر تفاعلي (Live Stream)
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddLectureModalOpen(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl shadow-md transition"
                >
                  حفظ ونشر المحاضرة للطلاب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD ADVANCED ASSIGNMENT (TEXT, VIDEO, IMAGE, FILE) */}
      {addAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900">طرح واجب أكاديمي مطور (متعدد الوسائط)</h3>
                <p className="text-xs text-slate-500">حدد نوع المرفق: نص، مقطع فيديو، صورة توضيحية مباشرة، أو ملف مستند</p>
              </div>
              <button
                onClick={() => setAddAssignmentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              {/* Assignment Type Selector */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">نوع وسائط الواجب المطلوب:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setAsgType('text')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      asgType === 'text'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>نص للواجب فقط</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAsgType('image')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      asgType === 'image'
                        ? 'bg-amber-50 border-amber-600 text-amber-900 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ImageIcon className="w-5 h-5 text-amber-600" />
                    <span>صورة توضيحية مباشرة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAsgType('video')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      asgType === 'video'
                        ? 'bg-red-50 border-red-600 text-red-900 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-5 h-5 text-red-600" />
                    <span>مقطع فيديو للشرح</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAsgType('file')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      asgType === 'file'
                        ? 'bg-purple-50 border-purple-600 text-purple-900 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <UploadCloud className="w-5 h-5 text-purple-600" />
                    <span>إرفاق ملف مستند</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان الواجب / التكليف</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الواجب الثالث - قيود اليومية وميزان المراجعة لشركة تجارية"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">المقرر الدراسي</label>
                  <select
                    value={asgCourse}
                    onChange={(e) => setAsgCourse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                  >
                    <option value="المحاسبة في بيئة التجارة الإلكترونية">المحاسبة في بيئة التجارة الإلكترونية</option>
                    <option value="نظم المعلومات المحاسبية (AIS)">نظم المعلومات المحاسبية (AIS)</option>
                    <option value="المعايير الدولية لإعداد التقارير (IFRS)">المعايير الدولية لإعداد التقارير (IFRS)</option>
                    <option value="المراجعة والتدقيق المالي">المراجعة والتدقيق المالي</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الموعد النهائي للتسليم</label>
                  <input
                    type="date"
                    required
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الدرجة القصوى</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={asgMaxScore}
                    onChange={(e) => setAsgMaxScore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              {/* Dynamic inputs according to asgType */}
              {asgType === 'image' && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                  <label className="block font-bold text-amber-900">
                    رابط أو مسار الصورة التوضيحية (يتم عرضها للطلاب مباشرة):
                  </label>
                  <input
                    type="url"
                    placeholder="https://... أو يمكنك استخدام الصورة المحاسبية النموذجية الافتراضية"
                    value={asgMediaUrl}
                    onChange={(e) => setAsgMediaUrl(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 font-mono text-xs"
                  />
                  <div className="flex gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setAsgMediaUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80')}
                      className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1 rounded-lg font-bold"
                    >
                      استخدام صورة جدول قائمة الدخل الافتراضية
                    </button>
                    <button
                      type="button"
                      onClick={() => setAsgMediaUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80')}
                      className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1 rounded-lg font-bold"
                    >
                      استخدام صورة ميزان المراجعة
                    </button>
                  </div>
                  {asgMediaUrl && (
                    <div className="mt-2 border rounded-xl overflow-hidden max-h-48 bg-white">
                      <img src={asgMediaUrl} alt="معاينة" className="w-full h-40 object-cover" />
                    </div>
                  )}
                </div>
              )}

              {asgType === 'video' && (
                <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl space-y-2">
                  <label className="block font-bold text-red-900">
                    رابط مقطع الفيديو التوضيحي (يوتيوب أو رابط مباشر):
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... أو قناة @drama7sd"
                    value={asgMediaUrl}
                    onChange={(e) => setAsgMediaUrl(e.target.value)}
                    className="w-full bg-white border border-red-300 rounded-xl p-2.5 font-mono text-xs dir-ltr text-left"
                  />
                  <div className="text-[11px] text-red-700">
                    يمكنك وضع أي رابط لشرح الواجب من قناة الكلية أو شرح تم إعداده مسبقاً.
                  </div>
                </div>
              )}

              {asgType === 'file' && (
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                  <label className="block font-bold text-purple-900">
                    اسم الملف المرفق للطلاب للتحميل:
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: كراسة_تمارين_المحاسبة_الإلكترونية_الوحدة_3.pdf"
                    value={asgFileName}
                    onChange={(e) => setAsgFileName(e.target.value)}
                    className="w-full bg-white border border-purple-300 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">وصف الواجب والمطلوب حله بالتفصيل</label>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب تفاصيل المعاملات المالية، العمليات المطلوب إثباتها، أو الأسئلة التحليلية بالتفصيل..."
                  value={asgDescription}
                  onChange={(e) => setAsgDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تعليمات التسليم للطلاب</label>
                <input
                  type="text"
                  placeholder="مثال: يرجى تسليم ملف PDF أو Excel متضمناً القيود، أو رفع صورة واضحة لدفتر اليومية."
                  value={asgInstructions}
                  onChange={(e) => setAsgInstructions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddAssignmentModalOpen(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl shadow-md transition"
                >
                  طرح الواجب ونشره للطلاب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ENHANCED GRADING & FEEDBACK WITH DIRECT MEDIA PREVIEW */}
      {gradingModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 my-6">
            <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  مراجعة وتقييم إجابة الطالب
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  {selectedSubmission.studentName} ({selectedSubmission.studentId})
                </h3>
                <p className="text-xs text-slate-500">{selectedSubmission.assignmentTitle} • {selectedSubmission.course}</p>
              </div>
              <button
                onClick={() => setGradingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Submission Content Viewer (Direct Image / Video / Document / Text) */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <span className="font-bold text-slate-800 block text-xs">
                محتوى الحل المرفوع من قِبل الطالب:
              </span>

              {/* If Image submission */}
              {selectedSubmission.fileType === 'image' && (
                <div className="space-y-2">
                  <div className="border border-slate-300 rounded-2xl overflow-hidden bg-black/5 max-h-60 relative group">
                    <img
                      src={selectedSubmission.mediaUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80'}
                      alt="حل الطالب"
                      className="w-full h-56 object-cover object-top"
                    />
                    <button
                      type="button"
                      onClick={() => setEnlargedImage(selectedSubmission.mediaUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80')}
                      className="absolute inset-0 bg-slate-950/40 text-white flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition font-bold"
                    >
                      <Eye className="w-5 h-5" /> تكبير الصورة واستعراض القيود بدقة
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    صورة دفتر اليومية / الجداول المرفوعة من الطالب ({selectedSubmission.fileName})
                  </span>
                </div>
              )}

              {/* If Video submission */}
              {selectedSubmission.fileType === 'video' && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-red-600" />
                    <div>
                      <strong className="block">فيديو الشرح المرفوع من الطالب</strong>
                      <span className="text-[11px] text-slate-600 font-mono">
                        {selectedSubmission.mediaUrl || 'https://youtube.com/watch?v=sample-accounting-solution'}
                      </span>
                    </div>
                  </div>
                  <a
                    href={selectedSubmission.mediaUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-red-700"
                  >
                    مشاهدة الفيديو
                  </a>
                </div>
              )}

              {/* If Document file */}
              {(!selectedSubmission.fileType || selectedSubmission.fileType === 'document') && (
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-blue-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <strong className="block">{selectedSubmission.fileName || 'كراسة_حل_الواجب.pdf'}</strong>
                      <span className="text-[11px] text-slate-500">{selectedSubmission.fileSize || '1.2 ميجابايت'}</span>
                    </div>
                  </div>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-xs">
                    جاهز للمراجعة
                  </span>
                </div>
              )}

              {/* Student text commentary */}
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">ملاحظات وشروحات الطالب المرفقة مع الحل:</span>
                <p className="text-slate-800 leading-relaxed italic">"{selectedSubmission.notes}"</p>
              </div>
            </div>

            {/* Grading Form */}
            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  الدرجة المستحقة المرصودة (من أصل 20 درجة):
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="20"
                  required
                  value={gradingScore}
                  onChange={(e) => setGradingScore(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-base font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  التغذية الراجعة الأكاديمية والملاحظات للطالب (Academic Feedback):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب التقييم الأكاديمي، الأخطاء المحاسبية إن وُجدت، والتوجيهات للطالب..."
                  value={gradingFeedback}
                  onChange={(e) => setGradingFeedback(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingModalOpen(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> حفظ واعتماد النتيجة وإرسالها للطالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENLARGED IMAGE POPUP */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2">
            <img src={enlargedImage} alt="عرض مكبر" className="w-full h-auto max-h-[80vh] object-contain" />
            <p className="text-center text-xs text-slate-600 p-2 font-bold">انقر في أي مكان للإغلاق</p>
          </div>
        </div>
      )}

      {/* MODAL 4: ADVANCED 50-QUESTION QUIZ BUILDER */}
      {addQuizModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  نظام الاختبارات الإلكترونية المتقدم (حتى 50 سؤالاً)
                </span>
                <h3 className="font-black text-lg sm:text-xl text-slate-900 mt-1">
                  إنشاء اختبار إلكتروني ذكي مع تحديد الإجابة النموذجية
                </h3>
              </div>
              <button
                onClick={() => setAddQuizModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Generator from Question Bank */}
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-black text-sm text-white">توليد فوري من بنك الأسئلة الأكاديمي المعتمد</h4>
                  <p className="text-xs text-slate-300">
                    اختر عدد الأسئلة لتعبئة الاختبار آلياً مع نماذج الإجابات والخيارات الصحيحة بضغطة زر واحدة:
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handlePopulateBank(10)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-xs"
                >
                  توليد 10 أسئلة محاسبية سريعة
                </button>
                <button
                  type="button"
                  onClick={() => handlePopulateBank(25)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-xs"
                >
                  توليد 25 سؤالاً فصلياً متوسطاً
                </button>
                <button
                  type="button"
                  onClick={() => handlePopulateBank(50)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> توليد بنك شامل بـ 50 سؤالاً نموذجياً!
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs">
              {/* Quiz General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">عنوان الاختبار</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الاختبار الشامل في المحاسبة الإلكترونية"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المقرر الدراسي</label>
                  <select
                    value={quizCourse}
                    onChange={(e) => setQuizCourse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
                  >
                    <option value="المحاسبة في بيئة التجارة الإلكترونية">المحاسبة في بيئة التجارة الإلكترونية</option>
                    <option value="نظم المعلومات المحاسبية (AIS)">نظم المعلومات المحاسبية (AIS)</option>
                    <option value="المعايير الدولية لإعداد التقارير (IFRS)">المعايير الدولية لإعداد التقارير (IFRS)</option>
                    <option value="المراجعة والتدقيق المالي">المراجعة والتدقيق المالي</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">مدة الاختبار (بالدقائق)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={quizDuration}
                    onChange={(e) => setQuizDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              {/* Questions Navigator Strip */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-800 text-xs">
                    فهرس الأسئلة ({quizQuestions.length} من 50 سؤالاً) • إجمالي الدرجات: {totalQuizPoints} درجة
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddBlankQuestion}
                      disabled={quizQuestions.length >= 50}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1 rounded-xl text-[11px] disabled:opacity-40"
                    >
                      + إضافة سؤال جديد
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(currentQuestionIndex)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1 rounded-xl text-[11px]"
                    >
                      حذف هذا السؤال
                    </button>
                  </div>
                </div>

                {/* Question badges */}
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 custom-scrollbar">
                  {quizQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-7 h-7 rounded-lg font-mono text-xs font-black transition ${
                        currentQuestionIndex === idx
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Question Editor Card */}
              {currentQ && (
                <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-black text-emerald-800 text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
                        {currentQuestionIndex + 1}
                      </span>
                      تحرير السؤال رقم {currentQuestionIndex + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-700 text-[11px]">درجة السؤال:</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={currentQ.points || 2}
                        onChange={(e) => updateCurrentQuestion('points', Number(e.target.value))}
                        className="w-16 bg-slate-50 border border-slate-300 rounded-lg p-1 text-center font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">نص السؤال:</label>
                    <textarea
                      rows={2}
                      required
                      value={currentQ.text}
                      onChange={(e) => updateCurrentQuestion('text', e.target.value)}
                      placeholder="اكتب نص السؤال بدقة..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-xs"
                    ></textarea>
                  </div>

                  {/* Options with Pre-defined Correct Radio */}
                  <div className="space-y-2">
                    <span className="block font-bold text-slate-800">
                      الخيارات الأربعة (حدد زر الخيار الدائري أمام الإجابة النموذجية الصحيحة):
                    </span>

                    {currentQ.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                          currentQ.correctOption === optIdx
                            ? 'bg-emerald-50/80 border-emerald-500'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          id={`opt_rad_${currentQuestionIndex}_${optIdx}`}
                          name={`correct_opt_${currentQuestionIndex}`}
                          checked={currentQ.correctOption === optIdx}
                          onChange={() => updateCurrentQuestion('correctOption', optIdx)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label
                          htmlFor={`opt_rad_${currentQuestionIndex}_${optIdx}`}
                          className="font-bold text-[11px] text-slate-700 shrink-0 cursor-pointer"
                        >
                          خيار {optIdx + 1}:
                        </label>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => updateCurrentOption(optIdx, e.target.value)}
                          className="flex-1 bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                        />
                        {currentQ.correctOption === optIdx && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                            الإجابة النموذجية المعتمدة ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Question navigation footer */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                      className="text-slate-600 hover:text-slate-900 font-bold text-xs flex items-center gap-1 disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" /> السؤال السابق
                    </button>
                    <span className="text-[11px] font-mono text-slate-500">
                      {currentQuestionIndex + 1} / {quizQuestions.length}
                    </span>
                    <button
                      type="button"
                      disabled={currentQuestionIndex === quizQuestions.length - 1}
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
                      className="text-slate-600 hover:text-slate-900 font-bold text-xs flex items-center gap-1 disabled:opacity-30"
                    >
                      السؤال التالي <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddQuizModalOpen(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> حفظ ونشر الاختبار الإلكتروني ({quizQuestions.length} سؤالاً) للطلاب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      <VideoPlayerModal
        lecture={previewLecture}
        isOpen={Boolean(previewLecture)}
        onClose={() => setPreviewLecture(null)}
      />
    </div>
  );
};
