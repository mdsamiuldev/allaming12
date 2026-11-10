import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatBDT, toBengaliNumber } from '../utils/financeStats';
import {
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  HeartHandshake,
  Sparkles,
  TrendingUp,
  Coins,
  Edit3,
  X,
  Check,
} from 'lucide-react';

interface LiveTreasuryBannerProps {
  onNavigateTab: (tab: 'family' | 'chanda' | 'eid' | 'trust') => void;
}

export const LiveTreasuryBanner: React.FC<LiveTreasuryBannerProps> = ({ onNavigateTab }) => {
  const {
    currentUser,
    isAdmin,
    totalCurrentBalance,
    liveFundSummary,
    updateBaseOpeningFund,
    baseOpeningFund,
  } = useApp();

  const [isEditingBase, setIsEditingBase] = useState(false);
  const [newBaseInput, setNewBaseInput] = useState<number>(baseOpeningFund);

  const handleSaveBase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || newBaseInput < 0) return;
    updateBaseOpeningFund(Number(newBaseInput));
    setIsEditingBase(false);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/60 relative overflow-hidden mb-8 animate-fadeIn">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>স্বয়ংক্রিয় লাইভ বাজেট ও ব্যালেন্স ট্র্যাকার</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white flex items-center gap-2">
            <span>বর্তমানে আমাদের ব্যালেন্সে মোট টাকা</span>
          </h2>

          <div className="flex flex-wrap items-baseline gap-3 mt-2">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-amber-400 font-serif tracking-tight drop-shadow-sm">
              {formatBDT(totalCurrentBalance)}
            </span>
            <span className="text-xs bg-emerald-800/80 text-emerald-200 border border-emerald-600/70 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>লাইভ অটোমেটিক আপডেট সক্রিয়</span>
            </span>
          </div>

          <p className="text-emerald-200/90 text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
            {currentUser ? (
              <span>
                স্বাগতম, <strong className="text-white">{currentUser.name}</strong>! যে কেউ চাঁদা পরিশোধ করলেই
                তা স্বয়ংক্রিয়ভাবে সরাসরি এই ব্যালেন্সে যোগ হয়ে যায়। অ্যাডমিনকে আলাদাভাবে লিখে হিসাব করতে হয় না।
              </span>
            ) : (
              <span>
                মোল্লা পরিবারের কেন্দ্রীয় সমন্বিত তহবিল। যেকোনো সদস্যের মাসিক চাঁদা পরিশোধ করার সাথে সাথে তা
                স্বয়ংক্রিয়ভাবে ব্যালেন্সে যোগ হয়ে যায়।
              </span>
            )}
          </p>
        </div>

        {/* Quick Nav Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('chanda')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold px-5 py-3 rounded-2xl shadow-lg transition-all text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <CreditCard className="w-4 h-4 text-emerald-950" />
            <span>মাসিক চাঁদা তালিকা ও আদায়</span>
          </button>

          <button
            onClick={() => onNavigateTab('trust')}
            className="flex items-center justify-center gap-2 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 font-bold px-5 py-3 rounded-2xl border border-emerald-700/80 shadow transition-all text-xs sm:text-sm hover:text-white"
          >
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>কল্যাণ ট্রাস্ট ও সাহায্য বিবরণী</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Components Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-8 pt-6 border-t border-emerald-800/80">
        {/* Base Opening Reserve */}
        <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 relative group">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-medium mb-1">
            <span>প্রারম্ভিক রিজার্ভ তহবিল</span>
            {isAdmin && (
              <button
                onClick={() => {
                  setNewBaseInput(baseOpeningFund);
                  setIsEditingBase(true);
                }}
                className="text-amber-400 hover:text-amber-300 p-1 rounded hover:bg-emerald-900/60"
                title="প্রারম্ভিক রিজার্ভ পরিবর্তন করুন"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white font-serif block">
            {formatBDT(liveFundSummary.baseOpeningFund)}
          </span>
          <span className="text-[11px] text-emerald-300/80 mt-0.5 block">মূল ওপেনিং ব্যালেন্স</span>
        </div>

        {/* Chanda Collected (Auto Added) */}
        <div className="bg-emerald-950/70 border border-emerald-700/80 rounded-2xl p-4">
          <span className="text-xs text-amber-300 font-medium block mb-1 flex items-center justify-between">
            <span>চাঁদা হতে সংগৃহীত</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
              + অটো যোগ
            </span>
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-serif block">
            +{formatBDT(liveFundSummary.totalChandaCollected)}
          </span>
          <span className="text-[11px] text-emerald-300/80 mt-0.5 block">সকল পরিশোধিত চাঁদার যোগফল</span>
        </div>

        {/* Aid Disbursed */}
        <div className="bg-emerald-950/70 border border-rose-900/60 rounded-2xl p-4">
          <span className="text-xs text-rose-300 font-medium block mb-1 flex items-center justify-between">
            <span>চিকিৎসা ও বিপদকালীন সাহায্য</span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
              - তহবিল থেকে ব্যয়
            </span>
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-rose-400 font-serif block">
            -{formatBDT(liveFundSummary.totalAidDisbursed)}
          </span>
          <span className="text-[11px] text-rose-200/80 mt-0.5 block">অনুমোদিত রোগীর সহায়তা বাবদ</span>
        </div>

        {/* Net Current Balance */}
        <div className="bg-gradient-to-br from-amber-500/20 to-emerald-900/80 border border-amber-400/50 rounded-2xl p-4 shadow-inner">
          <span className="text-xs text-amber-200 font-bold block mb-1">বর্তমান অবশিষ্ট ফান্ড</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif block">
            {formatBDT(totalCurrentBalance)}
          </span>
          <span className="text-[11px] text-amber-200/80 mt-0.5 block">তহবিলের নিট উদ্বৃত্ত ক্যাশ</span>
        </div>
      </div>

      {/* Admin Edit Base Reserve Modal */}
      {isEditingBase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn text-slate-900">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 relative">
            <button
              onClick={() => setIsEditingBase(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">
              প্রারম্ভিক রিজার্ভ তহবিল সমন্বয়
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              মূল ওপেনিং রিজার্ভ তহবিল নির্ধারণ করুন। পরবর্তীতে প্রতি সদস্য চাঁদা দিলে তা এর সাথে স্বয়ংক্রিয়ভাবে যোগ হবে।
            </p>

            <form onSubmit={handleSaveBase} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  প্রারম্ভিক রিজার্ভের পরিমাণ (টাকা) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  value={newBaseInput}
                  onChange={(e) => setNewBaseInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-sm font-mono font-bold outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingBase(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-800 text-white rounded-xl shadow hover:bg-emerald-900"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
