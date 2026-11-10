import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/financeStats';
import {
  Users,
  CreditCard,
  Moon,
  HeartHandshake,
  ShieldCheck,
  UserCheck,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
  Wallet,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'family' | 'chanda' | 'eid' | 'trust';
  setActiveTab: (tab: 'family' | 'chanda' | 'eid' | 'trust') => void;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogin,
  onOpenProfile,
}) => {
  const { currentUser, isAdmin, logout, toggleAdminMode, totalCurrentBalance } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'family', label: 'পরিবার ও সদস্য', icon: Users, desc: 'সদস্য তালিকা ও তথ্য' },
    { id: 'chanda', label: 'মাসিক চাঁদা তহবিল', icon: CreditCard, desc: 'সবার চাঁদা (কোনো লিমিট নেই)' },
    { id: 'eid', label: 'ঈদ অনুষ্ঠান ও খরচ', icon: Moon, desc: 'ফিতর ও আজহা বাজেট' },
    { id: 'trust', label: 'কল্যাণ ট্রাস্ট', icon: HeartHandshake, desc: 'অসুস্থতায় জরুরি সাহায্য' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-emerald-900/95 text-white backdrop-blur-md border-b border-emerald-700/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Family Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('family')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-emerald-950 font-bold shadow-md shadow-amber-500/20 ring-2 ring-amber-300/60">
              <span className="text-2xl font-serif">ম</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white font-serif flex items-center gap-1.5">
                  মোল্লা পরিবার
                </h1>
                <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-medium">
                  পারিবারিক পোর্টাল
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 font-normal">
                একতা, ঐতিহ্য, মাসিক চাঁদা ও কল্যাণ ট্রাস্ট
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-emerald-950/60 p-1.5 rounded-2xl border border-emerald-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-emerald-950 shadow-md font-bold'
                      : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-950' : 'text-amber-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Live Balance Widget & User Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Live Auto Balance Widget */}
            <div
              onClick={() => setActiveTab('trust')}
              className="flex items-center gap-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-emerald-950 px-3.5 py-2 rounded-2xl shadow-md border border-amber-200 cursor-pointer transition-all hover:scale-105 active:scale-95 group"
              title="বর্তমান সমন্বিত তহবিল ব্যালেন্স (চাঁদা ও অনুদানের স্বয়ংক্রিয় লাইভ হিসাব)"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-950 text-amber-300 flex items-center justify-center font-bold text-sm shadow-inner group-hover:bg-emerald-900 transition-colors">
                ৳
              </div>
              <div className="text-left leading-tight pr-1">
                <span className="text-[10px] font-bold text-emerald-900/80 block uppercase tracking-wider">
                  বর্তমান ব্যালেন্স
                </span>
                <span className="text-sm font-extrabold font-serif text-emerald-950 block">
                  {formatBDT(totalCurrentBalance)}
                </span>
              </div>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Admin Mode Toggle Pill */}
                <button
                  onClick={toggleAdminMode}
                  title="অ্যাডমিন মোড পরিবর্তন করুন"
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-all ${
                    isAdmin
                      ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 hover:bg-amber-400/30'
                      : 'bg-emerald-800/50 border-emerald-700 text-emerald-200 hover:bg-emerald-800'
                  }`}
                >
                  {isAdmin ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>অ্যাডমিন মোড সক্রিয়</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>সদস্য মোড (শুধুমাত্র দর্শন)</span>
                    </>
                  )}
                </button>

                {/* Profile Pill */}
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 bg-emerald-950/70 hover:bg-emerald-950 border border-emerald-700/80 rounded-xl px-3 py-1.5 text-left transition-all group"
                >
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/70"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-white group-hover:text-amber-300 truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-emerald-300/80 truncate max-w-[120px]">
                      {currentUser.email}
                    </p>
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  title="লগআউট"
                  className="p-2 rounded-xl bg-emerald-950/50 hover:bg-rose-900/60 text-emerald-200 hover:text-rose-200 border border-emerald-800 hover:border-rose-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold px-4 py-2 rounded-xl shadow-md transition-all duration-200 text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>জিমেইল দিয়ে লগইন</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button & Mobile Balance */}
          <div className="flex md:hidden items-center gap-2">
            <div
              onClick={() => setActiveTab('trust')}
              className="bg-amber-400 text-emerald-950 px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-sm"
            >
              <span>৳</span>
              <span>{formatBDT(totalCurrentBalance)}</span>
            </div>

            {currentUser && (
              <button
                onClick={onOpenProfile}
                className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-amber-400"
              >
                <img src={currentUser.photoUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-emerald-950 text-emerald-200 border border-emerald-800"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-800/80 space-y-3">
            {/* Mobile Big Live Balance Card */}
            <div className="bg-gradient-to-r from-amber-400 to-amber-300 text-emerald-950 p-3 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 text-amber-300 flex items-center justify-center font-bold text-sm">
                  ৳
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-900/80 block uppercase">বর্তমান ব্যালেন্স</span>
                  <span className="text-base font-extrabold font-serif">{formatBDT(totalCurrentBalance)}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-950/20 text-emerald-950 px-2 py-0.5 rounded-full">
                অটো আপডেট
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-amber-400 text-emerald-950 shadow'
                        : 'bg-emerald-950/70 text-emerald-100 hover:bg-emerald-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {currentUser ? (
              <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-200 font-medium">মোড:</span>
                  <button
                    onClick={toggleAdminMode}
                    className={`text-xs px-2 py-1 rounded-md font-semibold ${
                      isAdmin ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-800 text-emerald-200'
                    }`}
                  >
                    {isAdmin ? 'অ্যাডমিন' : 'সদস্য'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onOpenProfile();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs bg-emerald-800 px-3 py-1.5 rounded-lg text-white"
                  >
                    প্রোফাইল
                  </button>
                  <button
                    onClick={logout}
                    className="text-xs bg-rose-900/60 text-rose-200 px-3 py-1.5 rounded-lg border border-rose-700"
                  >
                    লগআউট
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-amber-400 text-emerald-950 font-bold py-2.5 rounded-xl text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>জিমেইল দিয়ে লগইন করুন</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Admin Quick Banner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-emerald-950 py-1 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            আপনি বর্তমানে <strong>অ্যাডমিন হিসেবে লগইন আছেন</strong>। আপনি পরিবারের তথ্য, চাঁদার হিসাব, বাজেট ও ট্রাস্ট রেকর্ড আপডেট করতে পারবেন।
          </span>
        </div>
      )}
    </header>
  );
};
