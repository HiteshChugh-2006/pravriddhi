import React, { useState } from 'react';
import {
  Sparkles,
  Menu,
  X,
  User,
  Globe,
  LogIn,
  LogOut,
  CheckCircle2,
  Database,
  FileText,
  UserPlus,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { UserProfile, AuthUser } from '../../types';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  authUser: AuthUser | null;
  onOpenAuth: () => void;
  onOpenOnboarding: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  profile,
  authUser,
  onOpenAuth,
  onOpenOnboarding,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'careertwin', label: 'CareerTwin' },
    { id: 'jobradar', label: 'JobRadar' },
    { id: 'skills', label: 'Skill Intelligence' },
    { id: 'careerpaths', label: 'Career Paths' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'resumestudio', label: 'Resume Studio' },
    { id: 'mentor', label: 'AI Mentor' },
    { id: 'workforce', label: 'Workforce Intelligence', isNew: true }
  ];

  const getInitials = (name?: string, email?: string): string => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email && email.trim()) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'PV';
  };

  const isGuest = !authUser || authUser.provider === 'guest' || !authUser.email;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('landing')}
            className="group flex items-center gap-2.5 text-left focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors leading-none">
                Pravriddhi
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
                Career Digital Twin
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'text-indigo-700 bg-indigo-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                {item.id === 'workforce' && <Globe className="w-3 h-3 text-indigo-500" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Career Twin status */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Target Role Status summary */}
          {profile.targetRole && (
            <div
              onClick={() => onSelectTab('careertwin')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200/90 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
              title="Click to view Career Twin"
            >
              <span className="text-slate-500">Target:</span>
              <span className="font-semibold text-slate-900">{profile.targetRole}</span>
              {profile.targetRoleAlignment > 0 && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono font-bold text-indigo-700 tabular-nums">
                    {profile.targetRoleAlignment}%
                  </span>
                </>
              )}
            </div>
          )}

          {/* User Account Avatar & Dropdown */}
          <div className="relative">
            {authUser && !isGuest ? (
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 py-1 px-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs group"
                title={`${authUser.displayName || authUser.email} — Account settings`}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 text-white text-xs font-bold flex items-center justify-center shadow-2xs">
                  {getInitials(authUser.displayName, authUser.email)}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight max-w-[110px] truncate">
                    {authUser.displayName || authUser.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize leading-tight">
                    {authUser.provider === 'google' ? 'Google' : 'Verified'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && authUser && !isGuest && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                <div className="px-4 py-2.5 border-b border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 text-sm">{authUser.displayName || 'Pravriddhi User'}</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {authUser.provider === 'google' ? 'Google Auth' : 'Verified'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{authUser.email}</p>
                  
                  {/* Resume Status */}
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {profile.hasUploadedResume && profile.uploadedResumeName ? (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-slate-600 truncate font-medium">{profile.uploadedResumeName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No resume uploaded yet</span>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onSelectTab('resumestudio');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium flex items-center justify-between"
                  >
                    <span>{profile.hasUploadedResume ? 'View Active Resume' : 'Upload Resume'}</span>
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('careertwin');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium flex items-center justify-between"
                  >
                    <span>Manage CareerTwin Skills</span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  </button>

                  <button
                    onClick={() => {
                      onOpenOnboarding();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                  >
                    Run Onboarding Guide
                  </button>

                  <button
                    onClick={() => {
                      onOpenAuth();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium flex items-center justify-between"
                  >
                    <span>Switch Account</span>
                    <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onSignOut();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-1">
          {profile.targetRole && (
            <div className="py-2 px-3 mb-2 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-600">Active Twin: <strong className="text-slate-900">{profile.targetRole}</strong></span>
              {profile.targetRoleAlignment > 0 && (
                <span className="font-mono font-bold text-indigo-600">{profile.targetRoleAlignment}% Match</span>
              )}
            </div>
          )}
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-between ${
                  isActive
                    ? 'text-indigo-700 bg-indigo-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'workforce' && <Globe className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
