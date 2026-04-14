import React from 'react';
import { User, Calendar, Hash, BookOpen } from 'lucide-react';

export default function StudentHeader({ student, stats }) {
  return (
    <div className="glass-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-usa-maroon to-usa-maroon-light flex items-center justify-center shadow-lg shadow-usa-maroon/20">
            <span className="text-3xl font-heading text-white">
              {student.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-status-cleared flex items-center justify-center border-2 border-[#0f0f1a]">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Student Info */}
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl text-white tracking-wider leading-none">
            {student.name}
          </h2>
          <p className="text-usa-gold font-body font-semibold text-sm mt-1">
            {student.program}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <Hash className="w-3.5 h-3.5" />
              <span>{student.studentId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{student.yearLevel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
              <Calendar className="w-3.5 h-3.5" />
              <span>{student.semester}</span>
            </div>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${stats.progress * 2.64} ${264 - stats.progress * 2.64}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#800000" />
                  <stop offset="100%" stopColor="#F4C430" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-heading text-white leading-none">
                {stats.progress}%
              </span>
              <span className="text-[10px] font-body text-white/40 mt-0.5">CLEARED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
