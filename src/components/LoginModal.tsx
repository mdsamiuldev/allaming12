import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, ShieldCheck, UserCheck, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle } = useApp();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleAdminQuickLogin = () => {
    loginWithGoogle('samiul122344@gmail.com', 'এমডি সামিউল ইসলাম');
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    loginWithGoogle(customEmail, customName || customEmail.split('@')[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-700" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Mail className="w-7 h-7 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif">মোল্লা পরিবার পোর্টালে লগইন</h2>
          <p className="text-sm text-gray-600 mt-1">
            আপনার জিমেইল (Gmail) অ্যাকাউন্ট দিয়ে প্রবেশ করুন এবং পরিবারের হিসাব-নিকাশ দেখুন।
          </p>
        </div>

        {/* Fast 1-Click for Samiul Islam (Admin) */}
        <div className="mb-6 bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-200/80 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              প্রধান অ্যাডমিন লগইন
            </span>
            <span className="text-[11px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              পূর্ণ নিয়ন্ত্রণ
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            ডেভেলপার ও পরিবারের মূল অ্যাডমিন অ্যাকাউন্ট দিয়ে সরাসরি লগইন করতে নিচের বাটনে চাপ দিন:
          </p>
          <button
            onClick={handleAdminQuickLogin}
            className="w-full flex items-center justify-center gap-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all group"
          >
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-emerald-900">
              G
            </div>
            <span>samiul122344@gmail.com দিয়ে প্রবেশ</span>
          </button>
        </div>

        <div className="relative my-6 text-center">
          <hr className="border-gray-200" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-medium text-gray-500">
            অথবা অন্য যেকোনো জিমেইল দিয়ে
          </span>
        </div>

        {/* Custom Gmail Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              আপনার জিমেইল এড্রেস (Gmail Address) *
            </label>
            <input
              type="email"
              required
              placeholder="example@gmail.com"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              আপনার পূর্ণ নাম (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="যেমন: শফিকুল ইসলাম মোল্লা"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>সদস্য হিসেবে প্রবেশ করুন</span>
          </button>
        </form>

        <p className="text-[11px] text-gray-500 text-center mt-4">
          * মোল্লা পরিবারের সকল সদস্য তাদের জিমেইল দিয়ে লগইন করে যাবতীয় চাঁদা, ঈদ খরচ ও কল্যাণ ট্রাস্টের সাহায্য বিবরণী স্বচ্ছভাবে দেখতে পারবেন।
        </p>
      </div>
    </div>
  );
};
