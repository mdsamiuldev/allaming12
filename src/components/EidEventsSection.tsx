import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EidEvent, ExpenseItem } from '../types';
import { calculateEidFinance, formatBDT, toBengaliNumber } from '../utils/financeStats';
import {
  Moon,
  Sparkles,
  Wallet,
  TrendingUp,
  Receipt,
  Hourglass,
  Plus,
  Edit3,
  Trash2,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Tag,
  DollarSign,
  X,
} from 'lucide-react';

export const EidEventsSection: React.FC = () => {
  const {
    eidEvents,
    updateEventFinances,
    addExpenseItem,
    updateExpenseItem,
    deleteExpenseItem,
    isAdmin,
  } = useApp();

  const [activeEventId, setActiveEventId] = useState<'eid-ul-fitr' | 'eid-ul-adha'>('eid-ul-fitr');

  // Admin Balance Update Modal
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [cashInHandInput, setCashInHandInput] = useState<number>(0);
  const [totalCollectedInput, setTotalCollectedInput] = useState<number>(0);
  const [estimatedBudgetInput, setEstimatedBudgetInput] = useState<number>(0);
  const [notesInput, setNotesInput] = useState<string>('');

  // Expense Item Add/Edit Modal
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<ExpenseItem['category']>('খাবার');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [actualCost, setActualCost] = useState<number>(0);
  const [purchasedBy, setPurchasedBy] = useState('');
  const [receiptNo, setReceiptNo] = useState('');
  const [isCompleted, setIsCompleted] = useState<boolean>(true);

  const currentEvent = eidEvents.find((e) => e.id === activeEventId) || eidEvents[0];
  const finance = calculateEidFinance(currentEvent);

  const openBalanceModal = () => {
    setCashInHandInput(currentEvent.cashInHand);
    setTotalCollectedInput(currentEvent.totalCollected);
    setEstimatedBudgetInput(currentEvent.estimatedBudget);
    setNotesInput(currentEvent.notes || '');
    setIsBalanceModalOpen(true);
  };

  const handleSaveBalances = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    updateEventFinances(activeEventId, {
      cashInHand: Number(cashInHandInput) || 0,
      totalCollected: Number(totalCollectedInput) || 0,
      estimatedBudget: Number(estimatedBudgetInput) || 0,
      notes: notesInput,
    });
    setIsBalanceModalOpen(false);
  };

  const openAddItemModal = () => {
    setEditingItemId(null);
    setItemName('');
    setItemCategory('খাবার');
    setEstimatedCost(3000);
    setActualCost(0);
    setPurchasedBy('');
    setReceiptNo('');
    setIsCompleted(false);
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: ExpenseItem) => {
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemCategory(item.category);
    setEstimatedCost(item.estimatedCost);
    setActualCost(item.actualCost);
    setPurchasedBy(item.purchasedBy || '');
    setReceiptNo(item.receiptNo || '');
    setIsCompleted(item.isCompleted);
    setIsItemModalOpen(true);
  };

  const handleSaveExpenseItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !itemName.trim()) return;

    const payload = {
      name: itemName.trim(),
      category: itemCategory,
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || 0,
      purchasedBy: purchasedBy.trim(),
      receiptNo: receiptNo.trim(),
      isCompleted,
    };

    if (editingItemId) {
      updateExpenseItem(activeEventId, editingItemId, payload);
    } else {
      addExpenseItem(activeEventId, payload);
    }

    setIsItemModalOpen(false);
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Event Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-emerald-950/70 p-1.5 rounded-2xl border border-emerald-800 shadow-inner">
          <button
            onClick={() => setActiveEventId('eid-ul-fitr')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeEventId === 'eid-ul-fitr'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 shadow-md scale-[1.02]'
                : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>🌙 পবিত্র ঈদুল ফিতর</span>
          </button>

          <button
            onClick={() => setActiveEventId('eid-ul-adha')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeEventId === 'eid-ul-adha'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 shadow-md scale-[1.02]'
                : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🐑 পবিত্র ঈদুল আজহা</span>
          </button>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={openBalanceModal}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>তহবিল ও বাজেট আপডেট</span>
            </button>
            <button
              onClick={openAddItemModal}
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন খরচ যোগ করুন</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Event Showcase Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
              <Moon className="w-3.5 h-3.5" />
              পারিবারিক উৎসব ও সামগ্রিক ব্যয় বিবরণী
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
              {currentEvent.title}
            </h2>
            <p className="text-emerald-100/90 text-sm mt-2 max-w-2xl leading-relaxed">
              {currentEvent.subTitle}
            </p>
            {currentEvent.notes && (
              <p className="text-xs bg-emerald-950/60 text-emerald-200 p-2.5 rounded-xl border border-emerald-800/80 mt-3 inline-block">
                📢 {currentEvent.notes}
              </p>
            )}
          </div>
        </div>

        {/* The 4 Mandated Budget Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-emerald-700/60">
          {/* কত টাকা হাতে আছে (Cash in Hand) */}
          <div className="bg-emerald-950/70 border border-amber-400/60 rounded-2xl p-4 text-center relative group">
            <span className="text-xs text-amber-300 font-semibold block flex items-center justify-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>কত টাকা হাতে আছে</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif block mt-1">
              {formatBDT(finance.cashInHand)}
            </span>
            <span className="text-[11px] text-amber-200/80">বর্তমান নগদ স্থিতি (ক্যাশ)</span>
          </div>

          {/* কত টাকা উঠেছে (Total Collected) */}
          <div className="bg-emerald-950/70 border border-emerald-600/80 rounded-2xl p-4 text-center">
            <span className="text-xs text-emerald-300 font-semibold block flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>কত টাকা উঠেছে</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-serif block mt-1">
              {formatBDT(finance.totalCollected)}
            </span>
            <span className="text-[11px] text-emerald-200/80">মোট চাঁদা ও অনুদান আদায়</span>
          </div>

          {/* মোট কত খরচ হয়েছে (Total Spent) */}
          <div className="bg-emerald-950/70 border border-sky-600/80 rounded-2xl p-4 text-center">
            <span className="text-xs text-sky-300 font-semibold block flex items-center justify-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-sky-400" />
              <span>মোট কত খরচ হয়েছে</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif block mt-1">
              {formatBDT(finance.totalSpent)}
            </span>
            <span className="text-[11px] text-sky-200/80">আইটেম অনুযায়ী সর্বমোট ব্যয়</span>
          </div>

          {/* কত টাকা লাগতে পারে (Estimated Remaining Needed) */}
          <div className="bg-emerald-950/70 border border-orange-500/80 rounded-2xl p-4 text-center">
            <span className="text-xs text-orange-300 font-semibold block flex items-center justify-center gap-1">
              <Hourglass className="w-3.5 h-3.5 text-orange-400" />
              <span>আর কত লাগতে পারে</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-orange-300 font-serif block mt-1">
              {formatBDT(finance.remainingNeeded)}
            </span>
            <span className="text-[11px] text-orange-200/80">
              বাজেট: {formatBDT(finance.estimatedBudget)}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Expenses Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-serif flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-700" />
              <span>অনুষ্ঠানের যাবতীয় জিনিসপাতির তালিকা ও মূল্য</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              সকল ক্রয়কৃত ও প্রস্তাবিত মালামালের আনুমানিক দাম এবং প্রকৃত খরচের সঠিক বিবরণী।
            </p>
          </div>

          {isAdmin ? (
            <button
              onClick={openAddItemModal}
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>আইটেম যোগ করুন</span>
            </button>
          ) : (
            <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg border">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>অ্যাডমিন ছাড়া কেউ আপডেট করতে পারবে না</span>
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-4">জিনিসপাতির নাম</th>
                <th className="py-3.5 px-3">ক্যাটাগরি</th>
                <th className="py-3.5 px-3 text-right">আনুমানিক দাম</th>
                <th className="py-3.5 px-3 text-right">প্রকৃত খরচ</th>
                <th className="py-3.5 px-3 text-center">অবস্থা (স্ট্যাটাস)</th>
                <th className="py-3.5 px-3">ক্রয়কারী ও রসিদ</th>
                {isAdmin && <th className="py-3.5 px-3 text-center">অ্যাকশন</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {currentEvent.expenses.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                  {/* Item Name */}
                  <td className="py-3.5 px-4 font-bold text-gray-900 font-serif">
                    {item.name}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </td>

                  {/* Estimated Cost */}
                  <td className="py-3.5 px-3 text-right text-xs font-medium text-gray-500 font-mono">
                    {formatBDT(item.estimatedCost)}
                  </td>

                  {/* Actual Cost */}
                  <td className="py-3.5 px-3 text-right font-extrabold text-emerald-900 font-serif">
                    {item.actualCost > 0 ? formatBDT(item.actualCost) : (
                      <span className="text-xs text-gray-400 font-normal">এখনো হয়নি</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 text-center">
                    {item.isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>ক্রয় সম্পন্ন</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>পরিকল্পনাধীন</span>
                      </span>
                    )}
                  </td>

                  {/* Purchaser & Receipt */}
                  <td className="py-3.5 px-3 text-xs text-gray-600">
                    <p className="font-medium text-gray-800">{item.purchasedBy || 'কমিটি'}</p>
                    {item.receiptNo && (
                      <p className="text-[10px] text-gray-400 font-mono">ভাউচার: {item.receiptNo}</p>
                    )}
                  </td>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditItemModal(item)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                          title="সম্পাদনা"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`আপনি কি "${item.name}" খরচটি মুছে ফেলতে চান?`)) {
                              deleteExpenseItem(activeEventId, item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentEvent.expenses.length === 0 && (
          <div className="p-8 sm:p-12 text-center border-t border-gray-100">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-gray-800 font-serif">
              কোনো জিনিসপাতি বা খরচের হিসাব এখনো যুক্ত করা হয়নি
            </h4>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto leading-relaxed">
              আপনি যখনই প্রয়োজনীয় জিনিসপাতির নাম, আনুমানিক দাম ও প্রকৃত খরচ লিখে যোগ করবেন, তখন তা এখানে সাথে সাথে প্রদর্শিত হবে এবং ওপরের মোট বাজেটে হিসাব আপডেট হবে।
            </p>
            {isAdmin && (
              <button
                onClick={openAddItemModal}
                className="mt-4 inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ খরচ বা মালামাল লিখে যুক্ত করুন</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Admin Update Fund & Budget Modal */}
      {isBalanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
            <button
              onClick={() => setIsBalanceModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 font-serif mb-1">
              তহবিল ও বাজেট হালনাগাদ (অ্যাডমিন)
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              {currentEvent.title}-এর কত টাকা হাতে আছে ও কত উঠেছে তা আপডেট করুন।
            </p>

            <form onSubmit={handleSaveBalances} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-amber-600" />
                  <span>কত টাকা হাতে আছে (ক্যাশ ইন হ্যান্ড) *</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={cashInHandInput}
                  onChange={(e) => setCashInHandInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>কত টাকা উঠেছে (সর্বমোট সংগৃহীত চাঁদা) *</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={totalCollectedInput}
                  onChange={(e) => setTotalCollectedInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Hourglass className="w-3.5 h-3.5 text-orange-600" />
                  <span>আনুমানিক মোট বাজেট প্রয়োজন (টাকা)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={estimatedBudgetInput}
                  onChange={(e) => setEstimatedBudgetInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">বিশেষ ঘোষণা / নোট</label>
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="যেমন: ঈদের দিন সকাল ১০টায় প্যান্ডেলে আসতে হবে"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsBalanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-emerald-950 shadow-md"
                >
                  তহবিল আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Expense Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
            <button
              onClick={() => setIsItemModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 font-serif mb-1">
              {editingItemId ? 'খরচের আইটেম সম্পাদনা' : 'নতুন খরচ বা কেনাকাটা যোগ করুন'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              জিনিসপাতির নাম, আনুমানিক দাম ও প্রকৃত খরচের তথ্য দিন।
            </p>

            <form onSubmit={handleSaveExpenseItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  জিনিস বা সেবার নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: পোলাও চাল ও মসলা সামগ্রী"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ক্যাটাগরি *</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none bg-white font-medium"
                >
                  <option value="খাবার">খাবার (চাল, মাংস, মসলা, মিষ্টি)</option>
                  <option value="ডেকোরেশন">ডেকোরেশন (প্যান্ডেল, সাউন্ড, লাইটিং)</option>
                  <option value="সালামি ও উপহার">সালামি ও ছোটদের উপহার</option>
                  <option value="কোরবানি ও কসাই">কোরবানির পশু ও কসাই খরচ</option>
                  <option value="অন্যান্য">অন্যান্য সামগ্রী</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    আনুমানিক দাম (টাকা)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    প্রকৃত খরচ (টাকা)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={actualCost}
                    onChange={(e) => setActualCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    কে ক্রয় করেছে?
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সামিউল ইসলাম"
                    value={purchasedBy}
                    onChange={(e) => setPurchasedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ভাউচার / মেমো নং
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: M-104"
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="completedCheck"
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="completedCheck" className="text-xs font-bold text-gray-700">
                  ক্রয় বা খরচ সম্পন্ন হয়েছে
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 shadow-md"
                >
                  {editingItemId ? 'হালনাগাদ করুন' : 'খরচ সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
