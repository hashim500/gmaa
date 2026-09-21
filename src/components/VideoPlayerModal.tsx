import React from 'react';
import {
  X,
  Play,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  User,
  Download,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import { Lecture } from '../types';

interface VideoPlayerModalProps {
  lecture: Lecture | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  lecture,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !lecture) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="bg-slate-900 border border-slate-700/80 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative text-white my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                {lecture.course}
              </span>
              <h3 className="font-bold text-sm sm:text-base text-slate-100 mt-1 line-clamp-1">
                {lecture.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-9 h-9 rounded-full flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Embed Area */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${lecture.videoId}?autoplay=1&rel=0`}
            title={lecture.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Info & Educational Materials */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-400" />
                <span>أستاذ المقرر: <strong className="text-slate-200">{lecture.instructor}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{lecture.date}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>المدة: {lecture.duration}</span>
              </span>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${lecture.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-xl transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> فتح على يوتيوب مباشرة
            </a>
          </div>

          <div>
            <h4 className="font-bold text-xs text-slate-300 mb-1">وصف المحاضرة والأهداف الأكاديمية:</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
              {lecture.description}
            </p>
          </div>

          {/* Attached Lecture Resources */}
          {lecture.resources && lecture.resources.length > 0 && (
            <div>
              <h4 className="font-bold text-xs text-slate-300 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" /> المرفقات والمراجع الدراسية للمحاضرة:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lecture.resources.map((res, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Download className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="font-semibold text-slate-200 truncate">{res.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 bg-slate-900 px-2 py-0.5 rounded-md">
                      {res.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* College Youtube Channel Link */}
          <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-slate-200 font-semibold">
                قناة الكلية الرسمية والمحاضرات الأكاديمية على يوتيوب
              </span>
            </div>
            <a
              href="https://www.youtube.com/@drama7sd"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> زيارة القناة (@drama7sd)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
