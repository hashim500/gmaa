import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';
import { DEFAULT_TRANSCRIPT } from '../data/academicData';
import { printTranscriptDocument } from '../utils/printUtils';
import { User } from '../types';

interface TranscriptViewProps {
  currentUser: User | null;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ currentUser }) => {
  const [transcript] = useState(DEFAULT_TRANSCRIPT);
  const [selectedSemester, setSelectedSemester] = useState<string>('all');

  const filteredSemesters =
    selectedSemester === 'all'
      ? transcript.semesters
      : transcript.semesters.filter((s) => s.id === selectedSemester);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Top Banner & Crest */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#133e68] to-[#0b2545] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-right flex-col md:flex-row">
            <CollegeLogo size="xl" />
            <div className="space-y-1.5">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black inline-block">
                السجل الأكاديمي الرقمي المعتمد • NSCA
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                كشف الدرجات والبيان الأكاديمي التراكمي
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                وثيقة السجل الدراسي الشامل لكافة الفصول والمقررات المحاسبية، الساعات المكتسبة، والمعدل التراكمي المعتمد من أمانة الشؤون العلمية.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => printTranscriptDocument(transcript)}
              className="bg-[#c59b6d] hover:bg-[#b2834c] text-[#0b2545] font-black text-xs px-6 py-3 rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              طباعة كشف الدرجات المعتمد رسميًا
            </button>
          </div>
        </div>
      </div>

      {/* Student Profile Card & Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Student Info Box */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-black text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" /> البيانات الأكاديمية للطالب
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">اسم الطالب:</span>
              <span className="font-bold text-slate-900">{currentUser?.name || transcript.studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">الرقم الجامعي:</span>
              <span className="font-mono font-bold text-blue-900">{currentUser?.studentId || transcript.studentId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">التخصص والدرجة:</span>
              <span className="font-bold text-slate-800">{transcript.degree}</span>
            </div>
            <div>
              <span className="text-slate-500 block">سنة الالتحاق:</span>
              <span className="font-bold text-slate-800">{transcript.admissionYear}</span>
            </div>
          </div>
        </div>

        {/* CGPA Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" /> المعدل التراكمي العام (CGPA)
            </span>
            <div className="text-3xl font-black text-[#0b2545] mt-1 font-mono">
              {transcript.cumulativeGpa.toFixed(2)}{' '}
              <span className="text-xs text-slate-400 font-sans">/ 4.00</span>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {transcript.academicStanding}
          </div>
        </div>

        {/* Credits Hours Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" /> الساعات المكتسبة
            </span>
            <div className="text-3xl font-black text-[#8a6135] mt-1 font-mono">
              {transcript.totalCreditHours}{' '}
              <span className="text-xs text-slate-400 font-sans">/ 136 ساعة</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#c59b6d] h-full rounded-full transition-all"
                style={{ width: `${(transcript.totalCreditHours / 136) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              أنجز 76% من متطلبات التخرج ونيل البكالوريوس
            </span>
          </div>
        </div>
      </div>

      {/* Semester Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <button
          onClick={() => setSelectedSemester('all')}
          className={`px-4 py-2 rounded-xl font-bold transition flex-shrink-0 ${
            selectedSemester === 'all'
              ? 'bg-[#0b2545] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          كافة الفصول الدراسية (البيان الشامل)
        </button>
        {transcript.semesters.map((sem) => (
          <button
            key={sem.id}
            onClick={() => setSelectedSemester(sem.id)}
            className={`px-4 py-2 rounded-xl font-bold transition flex-shrink-0 ${
              selectedSemester === sem.id
                ? 'bg-[#0b2545] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {sem.semesterName}
          </button>
        ))}
      </div>

      {/* Semesters Course Breakdown Tables */}
      <div className="space-y-6">
        {filteredSemesters.map((sem) => (
          <div
            key={sem.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Semester Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  {sem.semesterName} • {sem.academicYear}
                </h4>
                <span className="text-xs text-slate-500">
                  عدد المقررات: {sem.courses.length} | الساعات المكتسبة بالفصل: {sem.earnedHours} ساعة
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">
                  المعدل الفصلي (GPA):{' '}
                  <strong className="text-slate-900 font-mono text-sm">{sem.semesterGpa.toFixed(2)}</strong>
                </span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black px-2.5 py-0.5 rounded-lg">
                  التراكمي: {sem.cumulativeGpa.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100/60 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 font-bold">رمز المقرر</th>
                    <th className="p-3.5 font-bold">اسم المقرر الدراسي</th>
                    <th className="p-3.5 font-bold text-center">الساعات</th>
                    <th className="p-3.5 font-bold text-center">الدرجة (100)</th>
                    <th className="p-3.5 font-bold text-center">التقدير</th>
                    <th className="p-3.5 font-bold text-center">النقاط</th>
                    <th className="p-3.5 font-bold text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sem.courses.map((course) => (
                    <tr key={course.code} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-mono font-bold text-[#0b2545]">{course.code}</td>
                      <td className="p-3.5 font-bold text-slate-800">{course.title}</td>
                      <td className="p-3.5 text-center font-bold text-slate-600">{course.creditHours}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-900">{course.totalMark}</td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-md font-mono font-black text-xs ${
                            course.grade.startsWith('A')
                              ? 'bg-emerald-100 text-emerald-800'
                              : course.grade.startsWith('B')
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {course.grade}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-700">{course.points.toFixed(1)}</td>
                      <td className="p-3.5 text-center">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ناجح
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
