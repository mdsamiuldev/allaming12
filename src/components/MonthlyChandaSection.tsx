import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMonthlyChanda, formatBDT, toBengaliNumber } from '../utils/financeStats';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Calendar,
  Lock,
  Unlock,
  Search,
  Check,
  AlertCircle,
  FileText,
  UserCheck,
  DollarSign,
  Phone,
  ShieldCheck,
  Pencil,
  X,
  UserPlus,
  Trash2,
  Sparkles,
} from 'lucide-react';

export const MonthlyChandaSection: React.FC = () => {
  const {
    chandaMembers,
    addChandaMember,
    deleteChandaMember,
    updateChandaMember,
    monthlyPayments,
    selectedMonth,
    setSelectedMonth,
    togglePaymentStatus,
    updatePaymentRecord,
    totalCurrentBalance,
    isAdmin,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [searchMember, setSearchMember] = useState('');

  // Add Member Modal state
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberFather, setNewMemberFather] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberAmount, setNewMemberAmount] = useState<number>(500);
  const [newMemberMarkPaid, setNewMemberMarkPaid] = useState<boolean>(true);
  const [newMemberNote, setNewMemberNote] = useState<string>('নগদ জমা');
  
  // Member profile edit state (Name & Mobile)
  const [memberEditModal, setMemberEditModal] = useState<{
    id: number;
    name: string;
    fatherOrHusbandName: string;
    phone: string;
    monthlyAmount: number;
  } | null>(null);

  const [paymentEditModal, setPaymentEditModal] = useState<{
    memberId: number;
    name: string;
    isPaid: boolean;
    note: string;
    method: string;
    date: string;
  } | null>(null);

  const monthsList = [
    { value: '2026-01', label: 'জানুয়ারি ২০২৬' },
    { value: '2026-02', label: 'ফেব্রুয়ারি ২০২৬' },
    { value: '2026-03', label: 'মার্চ ২০২৬' },
    { value: '2026-04', label: 'এপ্রিল ২০২৬' },
    { value: '2026-05', label: 'মে ২০২৬' },
    { value: '2026-06', label: 'জুন ২০২৬' },
  ];

  const currentMonthLabel = monthsList.find((m) => m.value === selectedMonth)?.label || selectedMonth;

  const stats = calculateMonthlyChanda(chandaMembers, monthlyPayments, selectedMonth);

  const filteredMembers = chandaMembers.filter((member) => {
    const isPaid = stats.paidMemberIds.includes(member.id);
    if (filterStatus === 'paid' && !isPaid) return false;
    if (filterStatus === 'unpaid' && isPaid) return false;

    if (!searchMember.trim()) return true;
    const q = searchMember.toLowerCase();
    return (
      member.name.toLowerCase().includes(q) ||
      member.fatherOrHusbandName.toLowerCase().includes(q) ||
      member.phone.includes(q)
    );
  });

  const handleQuickToggle = (memberId: number) => {
    if (!isAdmin) return;
    togglePaymentStatus(memberId, selectedMonth);
  };

  const handleSaveModalPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentEditModal || !isAdmin) return;

    updatePaymentRecord({
      memberId: paymentEditModal.memberId,
      month: selectedMonth,
      isPaid: paymentEditModal.isPaid,
      amount: paymentEditModal.isPaid ? 500 : 0,
      paidDate: paymentEditModal.isPaid ? paymentEditModal.date : undefined,
      paymentMethod: paymentEditModal.method,
      note: paymentEditModal.note,
    });

    setPaymentEditModal(null);
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !isAdmin) return;
    addChandaMember({
      name: newMemberName.trim(),
      fatherOrHusbandName: newMemberFather.trim(),
      phone: newMemberPhone.trim(),
      monthlyAmount: Number(newMemberAmount) || 500,
      markPaidForMonth: newMemberMarkPaid ? selectedMonth : undefined,
      note: newMemberNote.trim() || 'পরিশোধিত',
    });
    setIsAddMemberModalOpen(false);
    setNewMemberName('');
    setNewMemberFather('');
    setNewMemberPhone('');
    setNewMemberAmount(500);
    setNewMemberMarkPaid(true);
    setNewMemberNote('নগদ জমা');
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-br from-amber-700 via-amber-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-600/50">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-200 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <CreditCard className="w-3.5 h-3.5" />
              <span>পরিবারের উন্মুক্ত মাসিক চাঁদা তহবিল (কোনো লিমিট নেই)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-white">
              মাসিক চাঁদা তহবিল (প্রতি জন ৫০০ ৳)
            </h2>
            <p className="text-amber-100/90 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              মোল্লা পরিবারের যে কেউ যেকোনো মাসে চাঁদা দিতে পারবেন—এখানে কোনো সদস্যের লিমিট নেই। যে টাকা দেবে
              অ্যাডমিন তার নাম এখানে বসাবেন।{' '}
              <strong className="text-amber-300">টাকা পরিশোধ চিহ্নিত করলেই তা স্বয়ংক্রিয়ভাবে মূল ব্যালেন্সে যোগ হয়ে যায়।</strong>
            </p>
          </div>

          {/* Action & Month Controls */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {isAdmin && (
              <button
                onClick={() => setIsAddMemberModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold px-5 py-3 rounded-2xl shadow-lg transition-all text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4 text-emerald-950" />
                <span>+ নতুন চাঁদা দাতা যোগ করুন</span>
              </button>
            )}

            {/* Month Selector dropdown */}
            <div className="bg-emerald-950/80 border border-amber-400/40 rounded-2xl p-3.5 shadow-lg flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>মাস:</span>
              </span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-emerald-900 border border-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {monthsList.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4 Financial Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-amber-600/40">
          <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 text-center">
            <span className="text-xs text-amber-200 font-medium block">মোট চাঁদা দাতা</span>
            <span className="text-3xl font-extrabold text-white font-serif block mt-1">
              {toBengaliNumber(chandaMembers.length)} জন
            </span>
            <span className="text-[11px] text-emerald-300">কোনো সীমাবদ্ধতা নেই</span>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 text-center">
            <span className="text-xs text-emerald-200 font-medium block">ধার্যকৃত মোট চাঁদা</span>
            <span className="text-3xl font-extrabold text-amber-300 font-serif block mt-1">
              {formatBDT(stats.expectedTotal)}
            </span>
            <span className="text-[11px] text-emerald-300">চলতি মাসের সম্ভাব্য কালেকশন</span>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-600/80 rounded-2xl p-4 text-center">
            <span className="text-xs text-emerald-300 font-medium block flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>আদায় হয়েছে ({toBengaliNumber(stats.paidCount)} জন)</span>
            </span>
            <span className="text-3xl font-extrabold text-emerald-400 font-serif block mt-1">
              {formatBDT(stats.totalCollected)}
            </span>
            <span className="text-[11px] text-emerald-200">
              {stats.totalMembers > 0
                ? `${Math.round((stats.paidCount / stats.totalMembers) * 100)}% সংগৃহীত`
                : '০% সংগৃহীত'}
            </span>
          </div>

          <div className="bg-emerald-950/70 border border-rose-600/80 rounded-2xl p-4 text-center">
            <span className="text-xs text-rose-300 font-medium block flex items-center justify-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>বকেয়া আছে ({toBengaliNumber(stats.unpaidCount)} জন)</span>
            </span>
            <span className="text-3xl font-extrabold text-rose-400 font-serif block mt-1">
              {formatBDT(stats.totalDue)}
            </span>
            <span className="text-[11px] text-rose-200">
              {stats.unpaidCount === 0 ? 'সম্পূর্ণ আদায়কৃত' : 'জরুরি তাগাদা প্রযোজ্য'}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Notice / Permissions alert */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isAdmin
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-gray-50 border-gray-200 text-gray-700'
        }`}
      >
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-gray-600" />
            </div>
          )}
          <div className="text-xs">
            <p className="font-bold">
              {isAdmin
                ? 'অ্যাডমিন মোড সক্রিয়: নতুন সদস্য যোগ করতে পারেন এবং চাঁদা পরিশোধ চিহ্নিত করলেই স্বয়ংক্রিয়ভাবে ব্যালেন্সে যোগ হবে।'
                : 'সংরক্ষিত নিরাপত্তা: চাঁদা পরিশোধের স্ট্যাটাস ও নতুন সদস্য শুধুমাত্র অ্যাডমিন যোগ বা আপডেট করতে পারবেন।'}
            </p>
            <p className="text-gray-500 mt-0.5">
              বর্তমানে প্রদর্শিত হচ্ছে: <strong className="text-emerald-800">{currentMonthLabel}</strong> মাসের তালিকা।
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-emerald-200 shadow-sm text-emerald-900">
            নিবন্ধিত সদস্য: {toBengaliNumber(chandaMembers.length)} জন
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="সদস্যের নাম বা ফোন দিয়ে খুঁজুন..."
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            সকল সদস্য ({toBengaliNumber(chandaMembers.length)})
          </button>

          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterStatus === 'paid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>দিয়েছে ({toBengaliNumber(stats.paidCount)})</span>
          </button>

          <button
            onClick={() => setFilterStatus('unpaid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              filterStatus === 'unpaid'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>দেয়নি / বাকি ({toBengaliNumber(stats.unpaidCount)})</span>
          </button>
        </div>
      </div>

      {/* 15 Members Interactive Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-950 text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-4 text-center w-16">ক্রমিক</th>
                <th className="py-4 px-4">সদস্যের নাম ও অভিভাবক</th>
                <th className="py-4 px-4">মোবাইল নম্বর</th>
                <th className="py-4 px-4 text-right">নির্ধারিত চাঁদা</th>
                <th className="py-4 px-6 text-center">পরিশোধের স্ট্যাটাস</th>
                <th className="py-4 px-4">পরিশোধের তথ্য / নোট</th>
                <th className="py-4 px-4 text-center">অ্যাকশন (শুধু অ্যাডমিন)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredMembers.map((member) => {
                const isPaid = stats.paidMemberIds.includes(member.id);
                const paymentRecord = monthlyPayments.find(
                  (r) => r.memberId === member.id && r.month === selectedMonth
                );

                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-emerald-50/40 transition-colors ${
                      isPaid ? 'bg-white' : 'bg-rose-50/20'
                    }`}
                  >
                    {/* Serial */}
                    <td className="py-4 px-4 text-center font-bold text-gray-700 font-serif">
                      {toBengaliNumber(member.id)}
                    </td>

                    {/* Member Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{member.avatar}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-gray-900 font-serif">{member.name}</p>
                            {isAdmin && (
                              <button
                                onClick={() =>
                                  setMemberEditModal({
                                    id: member.id,
                                    name: member.name,
                                    fatherOrHusbandName: member.fatherOrHusbandName,
                                    phone: member.phone,
                                    monthlyAmount: member.monthlyAmount,
                                  })
                                }
                                className="p-1 rounded text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                title="নাম ও মোবাইল নম্বর পরিবর্তন করুন"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            পিতা/স্বামী: {member.fatherOrHusbandName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-4 text-xs font-mono text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <a href={`tel:${member.phone}`} className="hover:text-emerald-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{member.phone}</span>
                        </a>
                      </div>
                    </td>

                    {/* Monthly Amount */}
                    <td className="py-4 px-4 text-right font-extrabold text-gray-800 font-serif">
                      {toBengaliNumber(member.monthlyAmount)} ৳
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-center">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>৫০০ ৳ দিয়েছে (পরিশোধিত)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-sm">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>দেয়নি (৫০০ ৳ বাকি আছে)</span>
                        </span>
                      )}
                    </td>

                    {/* Note / Date */}
                    <td className="py-4 px-4 text-xs text-gray-600">
                      {isPaid ? (
                        <div>
                          <p className="font-medium text-emerald-800">
                            তারিখ: {paymentRecord?.paidDate || 'পরিশোধিত'}
                          </p>
                          {paymentRecord?.note && (
                            <p className="text-[11px] text-gray-500 italic">নোট: {paymentRecord.note}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-rose-600 font-medium">বকেয়া তালিকায় অন্তর্ভুক্ত</span>
                      )}
                    </td>

                    {/* Action Column */}
                    <td className="py-4 px-4 text-center">
                      {isAdmin ? (
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Name & Phone Edit Button */}
                          <button
                            onClick={() =>
                              setMemberEditModal({
                                id: member.id,
                                name: member.name,
                                fatherOrHusbandName: member.fatherOrHusbandName,
                                phone: member.phone,
                                monthlyAmount: member.monthlyAmount,
                              })
                            }
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100/70 border border-emerald-200 transition-colors"
                            title="সদস্যের নাম ও মোবাইল পরিবর্তন করুন"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Payment Status */}
                          <button
                            onClick={() => handleQuickToggle(member.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                              isPaid
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow'
                            }`}
                            title={isPaid ? 'বকেয়া হিসেবে চিহ্নিত করুন' : 'পরিশোধ চিহ্নিত করুন'}
                          >
                            {isPaid ? 'বকেয়া করুন' : 'পরিশোধ মার্ক করুন'}
                          </button>

                          {/* Payment Receipt / Note */}
                          <button
                            onClick={() => {
                              setPaymentEditModal({
                                memberId: member.id,
                                name: member.name,
                                isPaid: isPaid,
                                note: paymentRecord?.note || '',
                                method: paymentRecord?.paymentMethod || 'বিকাশ',
                                date: paymentRecord?.paidDate || new Date().toLocaleDateString('bn-BD'),
                              });
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-gray-100"
                            title="রসিদ বা নোট সম্পাদনা"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Member Button */}
                          <button
                            onClick={() => {
                              if (window.confirm(`আপনি কি "${member.name}" কে চাঁদার তালিকা থেকে মুছে ফেলতে চান?`)) {
                                deleteChandaMember(member.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                            title="সদস্যের নাম তালিকা থেকে মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center gap-1 text-[11px] text-gray-400 font-medium cursor-not-allowed"
                          title="শুধু অ্যাডমিন পরিবর্তন করতে পারে"
                        >
                          <Lock className="w-3.5 h-3.5 text-gray-400" />
                          <span>লক করা</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Payment Note Modal for Admin */}
      {paymentEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 relative">
            <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">
              চাঁদা রসিদ ও বিবরণী সম্পাদনা
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              সদস্য: <strong className="text-emerald-800">{paymentEditModal.name}</strong> ({currentMonthLabel})
            </p>

            <form onSubmit={handleSaveModalPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  চাঁদা পরিষদের স্ট্যাটাস
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentEditModal({ ...paymentEditModal, isPaid: true })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      paymentEditModal.isPaid
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    পরিশোধ করেছে (৫০০ ৳)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentEditModal({ ...paymentEditModal, isPaid: false })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      !paymentEditModal.isPaid
                        ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    দেয়নি / বাকি আছে
                  </button>
                </div>
              </div>

              {paymentEditModal.isPaid && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      পরিশোধের তারিখ
                    </label>
                    <input
                      type="text"
                      value={paymentEditModal.date}
                      onChange={(e) =>
                        setPaymentEditModal({ ...paymentEditModal, date: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      পরিশোধের মাধ্যম
                    </label>
                    <select
                      value={paymentEditModal.method}
                      onChange={(e) =>
                        setPaymentEditModal({ ...paymentEditModal, method: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none bg-white font-medium"
                    >
                      <option value="বিকাশ">বিকাশ (bKash)</option>
                      <option value="নগদ">নগদ (Nagad)</option>
                      <option value="নগদ জমা">সরাসরি হাতে নগদ</option>
                      <option value="ব্যাংক">ব্যাংক ট্রান্সফার</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">নোট / মন্তব্য</label>
                <input
                  type="text"
                  placeholder="যেমন: বিকাশে পাঠানো হয়েছে, ট্রানজেকশন আইডি"
                  value={paymentEditModal.note}
                  onChange={(e) =>
                    setPaymentEditModal({ ...paymentEditModal, note: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setPaymentEditModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 shadow-md"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit 15 Chanda Member Info Modal (Name, Father/Husband Name, Phone) */}
      {memberEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 relative">
            <button
              onClick={() => setMemberEditModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">
              সদস্যের তথ্য পরিবর্তন (ক্রমিক নং #{toBengaliNumber(memberEditModal.id)})
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              ১৫ জনের তালিকায় এই সদস্যের নাম ও মোবাইল নম্বর পরিবর্তন করুন।
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!memberEditModal.name.trim()) return;
                updateChandaMember(memberEditModal.id, {
                  name: memberEditModal.name,
                  fatherOrHusbandName: memberEditModal.fatherOrHusbandName,
                  phone: memberEditModal.phone,
                  monthlyAmount: Number(memberEditModal.monthlyAmount) || 500,
                });
                setMemberEditModal(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  সদস্যের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={memberEditModal.name}
                  onChange={(e) =>
                    setMemberEditModal({ ...memberEditModal, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  পিতা বা স্বামীর নাম
                </label>
                <input
                  type="text"
                  value={memberEditModal.fatherOrHusbandName}
                  onChange={(e) =>
                    setMemberEditModal({
                      ...memberEditModal,
                      fatherOrHusbandName: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    placeholder="০১৭১১-XXXXXX"
                    value={memberEditModal.phone}
                    onChange={(e) =>
                      setMemberEditModal({ ...memberEditModal, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    নির্ধারিত চাঁদা (টাকা)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={memberEditModal.monthlyAmount}
                    onChange={(e) =>
                      setMemberEditModal({
                        ...memberEditModal,
                        monthlyAmount: Number(e.target.value) || 500,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setMemberEditModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 shadow-md"
                >
                  তথ্য সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Chanda Member Modal (Admin Only, No Limit) */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-200 relative">
            <button
              onClick={() => setIsAddMemberModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <UserPlus className="w-4 h-4 text-amber-700" />
              </span>
              <h3 className="text-xl font-bold text-gray-900 font-serif">
                নতুন চাঁদা দাতা সদস্য যোগ করুন
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              মোল্লা পরিবারের যে কেউ চাঁদা দিতে পারবেন—কোনো লিমিট নেই। সদস্য যুক্ত করে চলতি মাসের চাঁদা এক ক্লিকেই
              পরিশোধিত মার্ক করতে পারবেন, যা তাৎক্ষণিক মূল ব্যালেন্সে যুক্ত হবে।
            </p>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  সদস্যের নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: জসিম মোল্লা"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    পিতা বা স্বামীর নাম
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: আঃ রশিদ মোল্লা"
                    value={newMemberFather}
                    onChange={(e) => setNewMemberFather(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    placeholder="০১৭১২-৩৪৫৬৭৮"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    মাসিক চাঁদার পরিমাণ (টাকা) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={newMemberAmount}
                    onChange={(e) => setNewMemberAmount(Number(e.target.value) || 500)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-extrabold text-emerald-800 outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    চলতি মাস ({currentMonthLabel})
                  </label>
                  <div className="flex items-center h-[42px] px-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-900">
                      <input
                        type="checkbox"
                        checked={newMemberMarkPaid}
                        onChange={(e) => setNewMemberMarkPaid(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500"
                      />
                      <span>টাকা এখনই পেয়েছি (পরিশোধিত)</span>
                    </label>
                  </div>
                </div>
              </div>

              {newMemberMarkPaid && (
                <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>স্বয়ংক্রিয় ব্যালেন্স বৃদ্ধি সক্রিয়</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    সদস্য যোগ করার সাথে সাথে <strong>{newMemberAmount} ৳</strong> চলতি মাসে পরিশোধিত হয়ে
                    আমাদের মূল ব্যালেন্সে যোগ হয়ে যাবে।
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                      পেমেন্ট নোট / মাধ্যম
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: নগদ জমা / বিকাশ"
                      value={newMemberNote}
                      onChange={(e) => setNewMemberNote(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 shadow-md transition-all font-serif"
                >
                  + তালিকায় যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
