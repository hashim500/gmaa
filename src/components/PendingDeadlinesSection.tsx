import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  FileCheck2,
  Upload,
  Calendar,
  User,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  Info,
} from 'lucide-react';
import { Assignment, Submission } from '../types';

interface PendingDeadlinesSectionProps {
  assignments: Assignment[];
  submissions: Submission[];
  studentId: string;
  onOpenUpload: (assignment: Assignment) => void;
  onViewAllAssignments: () => void;
}

export const PendingDeadlinesSection: React.FC<PendingDeadlinesSectionProps> = ({
  assignments,
  submissions,
  studentId,
  onOpenUpload,
  onViewAllAssignments,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [filter, setFilter] = useState<'all' | 'unsubmitted' | 'submitted'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Update clock every minute for accurate real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Helper to parse due date to timestamp
  const parseDueDate = (dateStr: string): number => {
    if (!dateStr) return 0;
    // Handle 'YYYY-MM-DD HH:mm'
    if (dateStr.includes(' ')) {
      const [d, t] = dateStr.split(' ');
      return new Date(`${d}T${t}:00`).getTime();
    }
    // Handle 'YYYY-MM-DD'
    if (dateStr.length === 10) {
      return new Date(`${dateStr}T23:59:59`).getTime();
    }
    return new Date(dateStr).getTime();
  };

  // Format date to readable Arabic representation
  const formatReadableDate = (dateStr: string): string => {
    try {
      const timestamp = parseDueDate(dateStr);
      if (isNaN(timestamp)) return dateStr;
      const date = new Date(timestamp);
      return date.toLocaleDateString('ar-SD', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to get time remaining details
  const getTimeRemaining = (dateStr: string) => {
    const dueTime = parseDueDate(dateStr);
    const diffMs = dueTime - currentTime;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffMs <= 0) {
      return {
        hoursLeft: 0,
        isWithin48h: false,
        isOverdue: true,
        urgency: 'overdue' as const,
        label: 'انتهى الموعد المحدد',
        badgeColor: 'bg-red-500/15 text-red-500 border-red-500/30',
        progressBarColor: 'bg-red-600',
        progressPct: 100,
      };
    }

    const hours = Math.floor(diffHours);
    const minutes = Math.floor((diffHours - hours) * 60);

    // Is it within next 48 hours?
    const isWithin48h = diffHours <= 48;

    let urgency: 'critical' | 'urgent' | 'upcoming' = 'upcoming';
    let label = '';
    let badgeColor = '';
    let progressBarColor = '';
    let progressPct = Math.min(100, Math.max(10, Math.round(((48 - diffHours) / 48) * 100)));

    if (diffHours <= 12) {
      urgency = 'critical';
      label = `عاجل جداً: متبقي ${hours} س و ${minutes} د فقط!`;
      badgeColor = 'bg-red-600 text-white animate-pulse border-red-700 shadow-xs';
      progressBarColor = 'bg-red-600';
    } else if (diffHours <= 24) {
      urgency = 'urgent';
      label = `مستحق اليوم: متبقي ${hours} ساعة و ${minutes} دقيقة`;
      badgeColor = 'bg-rose-500/15 text-rose-700 border-rose-300 dark:text-rose-300';
      progressBarColor = 'bg-rose-500';
    } else {
      urgency = 'upcoming';
      label = `مستحق غداً: متبقي ${hours} ساعة`;
      badgeColor = 'bg-amber-500/15 text-amber-800 border-amber-300 dark:text-amber-300';
      progressBarColor = 'bg-amber-500';
    }

    return {
      hoursLeft: diffHours,
      isWithin48h,
      isOverdue: false,
      urgency,
      label,
      badgeColor,
      progressBarColor,
      progressPct,
    };
  };

  // Filter assignments due within 48 hours
  const urgentAssignments = assignments
    .map((asg) => {
      const timing = getTimeRemaining(asg.dueDate);
      const studentSub = submissions.find(
        (s) => s.assignmentId === asg.id && (s.studentId === studentId || s.studentId === 'NSAC-2023-104')
      );
      return {
        ...asg,
        timing,
        submission: studentSub,
        isSubmitted: !!studentSub,
      };
    })
    .filter((item) => item.timing.isWithin48h)
    .sort((a, b) => parseDueDate(a.dueDate) - parseDueDate(b.dueDate));

  const totalUrgentCount = urgentAssignments.length;
  const unsubmittedCount = urgentAssignments.filter((a) => !a.isSubmitted).length;
  const submittedCount = urgentAssignments.filter((a) => a.isSubmitted).length;

  const displayedAssignments = urgentAssignments.filter((asg) => {
    if (filter === 'unsubmitted') return !asg.isSubmitted;
    if (filter === 'submitted') return asg.isSubmitted;
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-300/80 shadow-md overflow-hidden transition-all">
      {/* SECTION HEADER BAR */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#133e68] to-[#0b2545] text-white p-5 sm:p-6 border-b-2 border-[#c59b6d]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Header Title & Subtitle */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 shadow-inner">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              {unsubmittedCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-black text-white items-center justify-center">
                    {unsubmittedCount}
                  </span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  المواعيد النهائية العاجلة للواجبات
                </h3>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  خلال الـ 48 ساعة القادمة (Pending Deadlines)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                تنبيه أكاديمي فوري بالتكاليف الدراسية التي توشك فترتها المحددة على الانتهاء.
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Quick stats pills */}
            <div className="flex items-center bg-black/25 rounded-2xl p-1 border border-white/10 text-xs font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filter === 'all'
                    ? 'bg-[#c59b6d] text-[#0b2545] font-black shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                الكل ({totalUrgentCount})
              </button>
              <button
                onClick={() => setFilter('unsubmitted')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filter === 'unsubmitted'
                    ? 'bg-rose-500 text-white font-black shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                بانتظار التسليم ({unsubmittedCount})
              </button>
              <button
                onClick={() => setFilter('submitted')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filter === 'submitted'
                    ? 'bg-emerald-600 text-white font-black shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                تم التسليم ({submittedCount})
              </button>
            </div>

            <button
              onClick={onViewAllAssignments}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <span>كافة الواجبات ({assignments.length})</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180 text-amber-300" />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-5 sm:p-6 bg-slate-50/70">
        {displayedAssignments.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-base font-black text-slate-800">
                {filter === 'unsubmitted' && unsubmittedCount === 0 && totalUrgentCount > 0
                  ? 'رائع! لقد أنجزت وسلّمت كافة التكاليف المستحقة قريباً'
                  : 'لا توجد مواعيد نهائية عاجلة خلال الـ 48 ساعة القادمة'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {filter === 'unsubmitted' && unsubmittedCount === 0 && totalUrgentCount > 0
                  ? 'جميع الواجبات المستحقة خلال 48 ساعة تم تسليمها بنجاح وهي قيد المراجعة والتقييم الأكاديمي.'
                  : 'جميع تكاليفك الدراسية الحالية إما تم تسليمها أو أن موعد استحقاقها بعد أكثر من يومين.'}
              </p>
            </div>
            <div>
              <button
                onClick={onViewAllAssignments}
                className="bg-[#0b2545] hover:bg-[#133e68] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition inline-flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4 text-amber-300" />
                <span>استعراض كافة تكاليف الفصل الدراسي</span>
              </button>
            </div>
          </div>
        ) : (
          /* LIST OF URGENT ASSIGNMENTS */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {displayedAssignments.map((asg) => {
              const isExpanded = expandedId === asg.id;

              return (
                <div
                  key={asg.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                    !asg.isSubmitted
                      ? 'border-amber-300 hover:border-amber-400 ring-1 ring-amber-200/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Top / Timing Alert Banner */}
                  <div
                    className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-bold ${
                      asg.timing.urgency === 'critical'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : asg.timing.urgency === 'urgent'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                      <span className="font-mono text-[11px] font-black">{asg.timing.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border shadow-2xs font-semibold text-slate-600">
                        الموعد: {formatReadableDate(asg.dueDate)}
                      </span>
                    </div>
                  </div>

                  {/* Urgency Progress Bar */}
                  <div className="w-full bg-slate-100 h-1">
                    <div
                      className={`h-1 transition-all duration-500 ${asg.timing.progressBarColor}`}
                      style={{ width: `${asg.timing.progressPct}%` }}
                    ></div>
                  </div>

                  {/* Main Card Body */}
                  <div className="p-5 space-y-3.5 flex-1">
                    {/* Header tags: Course & Max Score */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="bg-[#0b2545]/10 text-[#0b2545] border border-[#0b2545]/20 text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
                        {asg.course}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>{asg.maxScore} درجة</span>
                        </span>

                        {asg.format === 'video' ? (
                          <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <Video className="w-3 h-3" /> فيديو
                          </span>
                        ) : asg.format === 'image' ? (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> مخطط
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <FileText className="w-3 h-3" /> مستند
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Assignment Title */}
                    <div>
                      <h4 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                        {asg.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                        {asg.description}
                      </p>
                    </div>

                    {/* Instructor and Status row */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{asg.instructor}</span>
                      </div>

                      <div>
                        {asg.isSubmitted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>تم التسليم</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>بانتظار التسليم</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Collapsible Details: Instructions & Attachments */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-200 space-y-2.5 bg-slate-50 -mx-5 -mb-3.5 p-4 text-xs">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-700 block">تعليمات التسليم:</span>
                          <p className="text-slate-600 leading-relaxed">{asg.instructions}</p>
                        </div>

                        {asg.attachments && asg.attachments.length > 0 && (
                          <div className="pt-2">
                            <span className="font-bold text-slate-700 block mb-1">مرفقات التكليف:</span>
                            <div className="flex flex-wrap gap-2">
                              {asg.attachments.map((att, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] text-slate-700 shadow-2xs"
                                >
                                  <FileText className="w-3 h-3 text-blue-600" />
                                  <span>{att}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {asg.submission && (
                          <div className="pt-2 border-t border-slate-200 text-[11px] space-y-1">
                            <div className="text-emerald-800 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>بيانات تسليمك: {asg.submission.fileName}</span>
                            </div>
                            <p className="text-slate-500">
                              تاريخ الإرسال: {asg.submission.submissionDate} • الحالة:{' '}
                              {asg.submission.status === 'graded'
                                ? `تم التصحيح (${asg.submission.score}/${asg.maxScore})`
                                : 'قيد المراجعة الأكاديمية'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : asg.id)}
                      className="text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 transition"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" /> إخفاء التفاصيل
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" /> استعراض التكليف والمرفقات
                        </>
                      )}
                    </button>

                    <div>
                      {asg.isSubmitted ? (
                        <button
                          onClick={() => onOpenUpload(asg)}
                          className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>تعديل الحل أو إعادة الرفع</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenUpload(asg)}
                          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm hover:shadow group"
                        >
                          <Upload className="w-4 h-4 text-slate-950 group-hover:scale-110 transition" />
                          <span>رفع الحل وتسليم الواجب الآن</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
