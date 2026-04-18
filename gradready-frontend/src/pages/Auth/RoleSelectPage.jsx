import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Shield, BookOpen, ArrowRight } from 'lucide-react';

export default function RoleSelectPage() {
  return (
    <div className="min-h-screen bg-[#111114] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-dark/50 via-[#111114] to-[#18181b]" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-maroon/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-maroon/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center gap-3 mb-12 animate-fade-in">
          <img src="/images/usa-seal.png" alt="USA Seal" className="w-12 h-12 rounded-xl object-contain shadow-lg shadow-maroon/20" />
          <span className="text-white font-bold text-2xl tracking-tight">GradReady</span>
        </div>

        <div className="text-center mb-16 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Welcome to the portal
          </h1>
          <p className="text-zinc-400 text-lg max-w-lg mx-auto">
            Choose your role to access the appropriate dashboard and manage graduation clearance.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
          {/* Student */}
          <RoleCard
            to="/login"
            icon={GraduationCap}
            title="Student"
            description="Track your clearance requirements and upload documents."
            delay={0.2}
          />

          {/* Faculty */}
          <RoleCard
            to="/faculty/login"
            icon={BookOpen}
            title="Faculty"
            description="Review and approve academic requirements for your students."
            delay={0.3}
          />

          {/* Admin */}
          <RoleCard
            to="/admin/login"
            icon={Shield}
            title="Administrator"
            description="Manage university settings, departments, and final approvals."
            delay={0.4}
          />
        </div>

        {/* Footer */}
        <p className="text-zinc-600 text-sm animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          © 2026 University of San Agustin · Iloilo City
        </p>
      </div>
    </div>
  );
}

function RoleCard({ to, icon: Icon, title, description, delay }) {
  return (
    <Link
      to={to}
      className="group bg-[#18181b]/80 backdrop-blur-sm border border-[#27272a] rounded-2xl p-8 hover:border-maroon/50 hover:bg-[#1c1c20] transition-all duration-300 flex flex-col items-center text-center animate-slide-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      <div className="w-16 h-16 bg-[#27272a] group-hover:bg-maroon/20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
        <Icon className="w-8 h-8 text-zinc-400 group-hover:text-maroon-light transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-maroon-light transition-colors">{title}</h3>
      <p className="text-zinc-400 text-sm mb-6 flex-1">
        {description}
      </p>
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 group-hover:text-white transition-colors">
        Continue
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
