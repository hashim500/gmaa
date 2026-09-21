import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  RotateCcw,
  BookOpen,
  Sparkles,
  Video,
  Search,
  Filter,
} from 'lucide-react';
import { ScheduleItem, User } from '../types';
import { storage } from '../services/storage';
import { CollegeLogo } from './CollegeLogo';

interface WeeklyScheduleViewProps {
  currentUser: User | null;
  onOpenLecture?: (lectureId: string) => void;
}

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  currentUser,
  onOpenLecture,
}) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // New item form
  const [newCourse, setNewCourse] = useState('');
  const [newInstructor, setNewInstructor] = useState('');
  const [newDay, setNewDay] = useState<'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'>('sunday');
  const [newTime, setNewTime] = useState('09:00 ص - 10:30 ص');
  const [newDuration, setNewDuration] = useState('90 دقيقة');
  const [newRoom, setNewRoom] = useState('القاعة الافتراضية 1');
  const [newNotes, setNewNotes] = useState('');

  const daysList: { id: string; label: string }[] = [
    { id: 'all', label: 'كامل أيام الأسبوع' },
    { id: 'sunday', label: 'الأحد' },
    { id: 'monday', label: 'الإثنين' },
    { id: 'tuesday', label: 'الثلاثاء' },
    { id: 'wednesday', label: 'الأربعاء' },
    { id: 'thursday', label: 'الخميس' },
    { id: 'saturday', label: 'السبت' },
  ];

  const loadData = () => {
    setSchedule(storage.getSchedule());
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('nsac_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('nsac_storage_updated', handleStorageUpdate);
  }, []);

  const handleToggleCompleted = (id: string) => {
    storage.toggleScheduleItemCompleted(id);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...schedule];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    storage.saveSchedule(newItems);
    showSavedNotification();
  };

  const handleMoveDown = (index: number) => {
    if (index === schedule.length - 1) return;
    const newItems = [...schedule];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    storage.saveSchedule(newItems);
    showSavedNotification();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('هل تريد بالتأكيد حذف هذه المحاضرة من جدولك الدراسي؟')) {
      storage.deleteScheduleItem(id);
    }
  };

  const handleResetSchedule = () => {
    if (confirm('هل تريد استعادة الجدول الدراسي الرسمي المعتمد من الكلية؟')) {
      storage.resetSchedule();
      showSavedNotification();
    }
  };

  const showSavedNotification = () => {
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse || !newInstructor) {
      alert('يرجى كتابة اسم المقرر والمحاضر');
      return;
    }

    const dayNameMap: Record<string, string> = {
      sunday: 'الأحد',
      monday: 'الإثنين',
      tuesday: 'الثلاثاء',
      wednesday: 'الأربعاء',
      thursday: 'الخميس',
      friday: 'الجمعة',
      saturday: 'السبت',
    };

    storage.addScheduleItem({
      dayOfWeek: newDay,
      dayNameAr: dayNameMap[newDay] || 'الأحد',
      course: newCourse,
      instructor: newInstructor,
      time: newTime,
      duration: newDuration,
      roomOrLink: newRoom,
      notes: newNotes,
      isCompleted: false,
      color: 'blue',
    });

    setShowAddModal(false);
    setNewCourse('');
    setNewInstructor('');
    setNewNotes('');
    showSavedNotification();
  };

  const filteredSchedule = schedule.filter((item) => {
    const matchesDay = selectedDay === 'all' || item.dayOfWeek === selectedDay;
    const matchesSearch =
      !searchQuery ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDay && matchesSearch;
  });

  const completedCount = schedule.filter((s) => s.isCompleted).length;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white p-6 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black">
                الفصل الدراسي الثاني 2026
              </span>
              <span className="bg-blue-800/80 text-blue-200 px-3 py-0.5 rounded-full text-xs font-bold">
                تفاعلي وقابل للتخصيص
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-3">
              <Calendar className="w-8 h-8 text-amber-400" />
              <span>جدول المحاضرات الأسبوعي الذكي</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              استعرض جدول المحاضرات الأكاديمية التفاعلية مع إمكانية تخصيص وإعادة ترتيب المواد حسب أولوياتك الدراسية، وتسجيل الحضور والمتابعة بضغطة زر.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة جلسة / مقرر خاص</span>
            </button>
            <button
              onClick={handleResetSchedule}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 border border-white/15"
            >
              <RotateCcw className="w-4 h-4" />
              <span>استعادة الجدول الرسمي</span>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3.5 rounded-xl">
            <span className="text-slate-400 block">إجمالي المحاضرات بالأسبوع</span>
            <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">{schedule.length} محاضرة</span>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl">
            <span className="text-slate-400 block">المحاضرات المحضورة / المكتملة</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5 block">{completedCount} محاضرة</span>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-slate-400 block">مستوى الإنجاز الأسبوعي</span>
            <span className="text-lg sm:text-xl font-black text-amber-300 mt-0.5 block">
              {schedule.length > 0 ? Math.round((completedCount / schedule.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Reorder Saved Toast */}
      {isSavedAlert && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-black px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> تم حفظ الترتيب والتحديث بنجاح
        </div>
      )}

      {/* Filters and Day Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Day Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {daysList.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDay(d.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedDay === d.id
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المقرر أو المحاضر..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Customization tip */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3 text-xs text-blue-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>ميزة إعادة الترتيب:</strong> يمكنك استخدام أزرار الأسهم (▲ و ▼) لإعادة ترتيب المحاضرات ووضع المواد الأهم في أعلى القائمة حسب تفضيلك الخاص!
            </span>
          </div>
          <span className="text-[11px] font-bold text-blue-700 hidden sm:inline">
            يُحفظ تلقائياً في حسابك
          </span>
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-3">
        {filteredSchedule.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto text-slate-300" />
            <p className="font-bold text-sm">لا توجد محاضرات مدرجة لهذا اليوم أو المعيار المحدد</p>
            <button
              onClick={() => setSelectedDay('all')}
              className="text-xs text-blue-700 font-bold hover:underline"
            >
              عرض كامل أيام الأسبوع
            </button>
          </div>
        ) : (
          filteredSchedule.map((item, index) => {
            const actualIndex = schedule.findIndex((s) => s.id === item.id);
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                  item.isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Left side / Main details */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Attendance Checkbox Button */}
                  <button
                    onClick={() => handleToggleCompleted(item.id)}
                    title={item.isCompleted ? 'إلغاء وضع الاكتمال' : 'تحديد كمحاضرة مكتملة الحضور'}
                    className={`mt-1 p-2 rounded-xl border transition shrink-0 ${
                      item.isCompleted
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-400 border-slate-300'
                    }`}
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-blue-100 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                        {item.dayNameAr}
                      </span>
                      <span className="font-mono text-xs text-slate-600 flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-blue-600" /> {item.time} ({item.duration})
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" /> {item.roomOrLink}
                      </span>
                      {item.isCompleted && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                          تم الحضور
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {item.course}
                    </h3>

                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">أستاذ المادة:</span> {item.instructor}
                    </p>

                    {item.notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 max-w-xl">
                        <strong>محاور الجلسة:</strong> {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side / Action Controls & Ordering */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  {/* Direct Lecture Room / Stream Link */}
                  {item.lectureId && onOpenLecture && (
                    <button
                      onClick={() => onOpenLecture(item.lectureId!)}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>دخول القاعة</span>
                    </button>
                  )}

                  {/* Ordering Controls (Up / Down) */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    <button
                      onClick={() => handleMoveUp(actualIndex)}
                      disabled={actualIndex === 0}
                      title="تقديم لأعلى في جدول الأولويات"
                      className="p-1.5 rounded-xl hover:bg-white text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono font-black text-slate-500 px-1.5">
                      {actualIndex + 1}
                    </span>
                    <button
                      onClick={() => handleMoveDown(actualIndex)}
                      disabled={actualIndex === schedule.length - 1}
                      title="تأخير لأسفل في جدول الأولويات"
                      className="p-1.5 rounded-xl hover:bg-white text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="حذف من الجدول"
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD SCHEDULE ITEM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-900 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CollegeLogo size="xs" />
                <h3 className="font-black text-base text-slate-900">
                  إضافة محاضرة أو جلسة مذاكرة للجدول
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المقرر / المادة الأكاديمية</label>
                <input
                  type="text"
                  required
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  placeholder="مثال: بحوث العمليات في المحاسبة المالية"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">أستاذ المادة أو المشرف</label>
                  <input
                    type="text"
                    required
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    placeholder="مثال: د. عبد الله النور"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">يوم المحاضرة</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="sunday">الأحد</option>
                    <option value="monday">الإثنين</option>
                    <option value="tuesday">الثلاثاء</option>
                    <option value="wednesday">الأربعاء</option>
                    <option value="thursday">الخميس</option>
                    <option value="saturday">السبت</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التوقيت</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="مثال: 09:00 ص - 10:30 ص"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">القاعة أو الرابط</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="مثال: القاعة الافتراضية 2"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات أو مواضيع المحاضرة</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="ملاحظات شخصية، متطلبات التحضير، أرقام الفصول..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white font-black px-6 py-2.5 rounded-xl transition shadow-md"
                >
                  إضافة إلى الجدول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
