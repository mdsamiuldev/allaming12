import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AidRecord, AidApplication } from '../types';
import { calculateTrustStats, formatBDT, toBengaliNumber } from '../utils/financeStats';
import {
  HeartHandshake,
  Activity,
  Heart,
  PlusCircle,
  FileCheck2,
  Calendar,
  AlertTriangle,
  Hospital,
  ShieldCheck,
  Lock,
  Search,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  Clock,
  Send,
  X,
  Trash2,
} from 'lucide-react';

export const TrustFundSection: React.FC = () => {
  const {
    trustFundPool,
    aidRecords,
    aidApplications,
    addAidRecord,
    deleteAidRecord,
    submitAidApplication,
    updateTrustFundPool,
    isAdmin,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'records' | 'apply' | 'applications'>('records');
  const [searchAid, setSearchAid] = useState('');

  // Admin Disburse Modal
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [reason, setReason] = useState<AidRecord['reason']>('অসুস্থতা ও চিকিৎসা');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(10000);
  const [date, setDate] = useState<string>(new Date().toLocaleDateString('bn-BD'));
  const [hospitalOrDoctor, setHospitalOrDoctor] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Admin Pool Update Modal
  const [isPoolModalOpen, setIsPoolModalOpen] = useState(false);
  const [poolInput, setPoolInput] = useState<number>(trustFundPool);

  // Member Application Form
  const [patientName, setPatientName] = useState('');
  const [patientRelation, setPatientRelation] = useState('');
  const [appReason, setAppReason] = useState('অসুস্থতা ও চিকিৎসা ব্যয়');
  const [requestedAmount, setRequestedAmount] = useState<number>(15000);
  const [appDescription, setAppDescription] = useState('');
  const [applicantPhone, setApplicantPhone] = useState(currentUser?.phone || '');
  const [appSubmitted, setAppSubmitted] = useState(false);

  const trustStats = calculateTrustStats(trustFundPool, aidRecords);

  const filteredRecords = aidRecords.filter((rec) => {
    if (!searchAid.trim()) return true;
    const q = searchAid.toLowerCase();
    return (
      rec.recipientName.toLowerCase().includes(q) ||
      rec.relationship.toLowerCase().includes(q) ||
      rec.reason.toLowerCase().includes(q) ||
      rec.description.toLowerCase().includes(q) ||
      (rec.hospitalOrDoctor && rec.hospitalOrDoctor.toLowerCase().includes(q))
    );
  });

  const handleDisburseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !recipientName.trim() || amount <= 0) return;

    addAidRecord({
      recipientName: recipientName.trim(),
      relationship: relationship.trim() || 'পরিবারের সদস্য',
      reason,
      description: description.trim(),
      amount: Number(amount),
      date: date.trim() || new Date().toLocaleDateString('bn-BD'),
      approvedBy: `${currentUser?.name || 'অ্যাডমিন'} (মোল্লা পরিবার ট্রাস্ট কমিটি)`,
      hospitalOrDoctor: hospitalOrDoctor.trim(),
      status: 'অনুমোদিত ও প্রদানকৃত',
      contactPhone: contactPhone.trim(),
    });

    setIsDisburseModalOpen(false);
    // Reset
    setRecipientName('');
    setRelationship('');
    setDescription('');
    setAmount(10000);
    setHospitalOrDoctor('');
    setContactPhone('');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    submitAidApplication({
      applicantName: currentUser?.name || 'অজ্ঞাত সদস্য',
      applicantEmail: currentUser?.email || '',
      applicantPhone,
      patientName: patientName.trim(),
      patientRelation: patientRelation.trim() || 'পারিবারিক সদস্য',
      reason: appReason,
      requestedAmount: Number(requestedAmount) || 0,
      description: appDescription.trim(),
    });

    setAppSubmitted(true);
    setPatientName('');
    setPatientRelation('');
    setAppDescription('');
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-br from-rose-950 via-emerald-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>জরুরি চিকিৎসা ও আপৎকালীন ফান্ড</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-white">
              মোল্লা পরিবার কল্যাণ ট্রাস্ট
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              &quot;আমরা সবাই মিলে টাকা দিয়ে এই ট্রাস্ট খুলেছি। আমাদের মোল্লা পরিবারের ভিতর কেউ যদি অসুস্থ হয় এবং
              তার কাছে টাকা না থাকে, অথবা কোনো বিপদে পড়লে—আমরা আমাদের ট্রাস্ট থেকে তাকে অবিলম্বে চিকিৎসা ও
              আর্থিক সাহায্য করব।&quot;
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isAdmin && (
              <>
                <button
                  onClick={() => setIsDisburseModalOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>সাহায্য লিপিবদ্ধ করুন</span>
                </button>
                <button
                  onClick={() => {
                    setPoolInput(trustFundPool);
                    setIsPoolModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-md border border-emerald-700"
                >
                  <span>তহবিল সাইজ আপডেট</span>
                </button>
              </>
            )}
            <button
              onClick={() => setActiveTab('apply')}
              className="flex items-center gap-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>সহায়তার আবেদন করুন</span>
            </button>
          </div>
        </div>

        {/* Trust KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-emerald-700/60">
          {/* Total Pool */}
          <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 text-center">
            <span className="text-xs text-emerald-300 font-medium block">মোট ট্রাস্ট তহবিল</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif block mt-1">
              {formatBDT(trustStats.totalFundPool)}
            </span>
            <span className="text-[11px] text-emerald-200/80">সকলের সমন্বিত অনুদান</span>
          </div>

          {/* Disbursed Aid */}
          <div className="bg-emerald-950/70 border border-rose-600/80 rounded-2xl p-4 text-center">
            <span className="text-xs text-rose-300 font-medium block flex items-center justify-center gap-1">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>মোট প্রদত্ত চিকিৎসা সাহায্য</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-serif block mt-1">
              {formatBDT(trustStats.totalDisbursed)}
            </span>
            <span className="text-[11px] text-rose-200/80">অসুস্থ সদস্যদের প্রদানকৃত</span>
          </div>

          {/* Available Reserve Balance */}
          <div className="bg-emerald-950/70 border border-amber-400/80 rounded-2xl p-4 text-center">
            <span className="text-xs text-amber-300 font-medium block flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>বর্তমান সংরক্ষিত স্থিতি</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif block mt-1">
              {formatBDT(trustStats.currentBalance)}
            </span>
            <span className="text-[11px] text-amber-200/80">জরুরি সেবায় প্রস্তুত নগদ</span>
          </div>

          {/* Beneficiaries Count */}
          <div className="bg-emerald-950/70 border border-teal-600/80 rounded-2xl p-4 text-center">
            <span className="text-xs text-teal-300 font-medium block flex items-center justify-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5 text-teal-400" />
              <span>সাহায্যপ্রাপ্ত সদস্য</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-serif block mt-1">
              {toBengaliNumber(trustStats.totalCasesHelped)} জন
            </span>
            <span className="text-[11px] text-teal-200/80">সফলভাবে সহায়তা প্রদান</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('records')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'records'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>কাকে সাহায্য করা হয়েছে (স্বচ্ছ তালিকা)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-700 text-white font-mono">
            {aidRecords.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('apply');
            setAppSubmitted(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'apply'
              ? 'bg-rose-700 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>জরুরি সহায়তার আবেদন ফরম</span>
        </button>

        {aidApplications.length > 0 && (
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'applications'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>জমা পড়া আবেদনসমূহ</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-emerald-950 font-bold">
              {aidApplications.length}
            </span>
          </button>
        )}
      </div>

      {/* VIEW 1: TRANSPARENT AID RECORDS LIST ("কাকে সাহায্য করা হয়েছে") */}
      {activeTab === 'records' && (
        <div className="space-y-6">
          {/* Search Bar & Header */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="প্রাপকের নাম, সম্পর্ক, অসুস্থতা বা হাসপাতাল দিয়ে অনুসন্ধান..."
                value={searchAid}
                onChange={(e) => setSearchAid(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>সকল পরিবারের সদস্যের জন্য সম্পূর্ণ উন্মুক্ত ও স্বচ্ছ</span>
            </div>
          </div>

          {/* Aid Records Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-rose-100 hover:border-rose-300 transition-all hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      <Activity className="w-3 h-3 text-rose-500" />
                      <span>{record.reason}</span>
                    </span>

                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{record.date}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 font-serif leading-tight">
                    {record.recipientName}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    সম্পর্ক: {record.relationship}
                  </p>

                  <div className="mt-4 bg-rose-50/40 p-3 rounded-2xl border border-rose-100/80">
                    <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                      অসুস্থতা ও সহায়তার বিবরণ:
                    </span>
                    <p className="text-xs text-gray-800 leading-relaxed">{record.description}</p>
                  </div>

                  {record.hospitalOrDoctor && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-gray-600">
                      <Hospital className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-gray-700 text-[11px] block">হাসপাতাল/ডাক্তার:</span>
                        <span>{record.hospitalOrDoctor}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block">প্রদত্ত অনুদান:</span>
                    <span className="text-xl font-extrabold text-rose-600 font-serif">
                      {formatBDT(record.amount)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{record.status}</span>
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${record.recipientName}" এর এই সাহায্য রেকর্ডটি মুছতে চান?`)) {
                            deleteAidRecord(record.id);
                          }
                        }}
                        className="text-[11px] text-rose-500 hover:text-rose-700 block mt-1 underline"
                      >
                        মুছে ফেলুন
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200">
              <HeartHandshake className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700 font-serif">কোনো রেকর্ড পাওয়া যায়নি</p>
              <p className="text-xs text-gray-500 mt-1">অনুসন্ধানের কি-ওয়ার্ড পরিবর্তন করে দেখুন।</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: APPLICATION FORM */}
      {activeTab === 'apply' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-serif">
              জরুরি চিকিৎসা ও বিপদকালীন সহায়তার আবেদন
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-lg mx-auto">
              মোল্লা পরিবারের কোনো সদস্য অসুস্থ হলে অথবা কোনো জরুরি অপারেশনের প্রয়োজন হলে ট্রাস্ট কমিটির কাছে
              সাহায্যের আবেদন জমা দিন।
            </p>
          </div>

          {appSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-950 font-serif">
                আপনার আবেদন সফলভাবে জমা হয়েছে!
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                মোল্লা পরিবার ট্রাস্ট কমিটি এবং প্রধান অ্যাডমিন সামিউল ইসলাম আপনার আবেদনটি পর্যালোচনা করবেন এবং
                অতি দ্রুত যোগাযোগ করে ট্রাস্ট তহবিল থেকে অনুদান প্রদান করা হবে।
              </p>
              <button
                onClick={() => {
                  setAppSubmitted(false);
                  setActiveTab('records');
                }}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow"
              >
                সাহায্য তালিকা দেখুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    রোগী বা বিপদগ্রস্ত সদস্যের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: করিম মোল্লা"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    পরিবারে সম্পর্ক *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: চাচা, ফুফু, ভাই"
                    value={patientRelation}
                    onChange={(e) => setPatientRelation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    সহায়তার কারণ *
                  </label>
                  <select
                    value={appReason}
                    onChange={(e) => setAppReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none bg-white font-medium"
                  >
                    <option value="অসুস্থতা ও চিকিৎসা ব্যয়">অসুস্থতা ও চিকিৎসা ব্যয়</option>
                    <option value="জরুরি অপারেশন ও হাসপাতাল ভর্তি">জরুরি অপারেশন ও হাসপাতাল ভর্তি</option>
                    <option value="দুর্ঘটনাজনিত চিকিৎসা">দুর্ঘটনাজনিত জরুরি চিকিৎসা</option>
                    <option value="ঔষধ ও থেরাপির খরচ">জরুরি ঔষধ ও থেরাপির খরচ</option>
                    <option value="আকস্মিক বিপদ ও আর্থিক সংকট">আকস্মিক বিপদ ও আর্থিক সংকট</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    প্রয়োজনীয় আর্থিক সহায়তা (টাকা) *
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  যোগাযোগের মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="০১৭১২-৩৪৫৬৭৮"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  অসুস্থতা ও বিপদের বিস্তারিত বিবরণ *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="রোগীর বর্তমান অবস্থা, কোন হাসপাতালে চিকিৎসা চলছে, ডাক্তার কী পরামর্শ দিয়েছেন ইত্যাদি বিস্তারিত লিখুন..."
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>ট্রাস্ট কমিটির নিকট আবেদন জমা দিন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* VIEW 3: SUBMITTED APPLICATIONS (ADMIN REVIEW) */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 font-serif">
            সদস্যদের জমাকৃত সহায়তার আবেদনপত্রসমূহ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aidApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-5 shadow-sm border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                    {app.reason}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{app.date}</span>
                </div>
                <h4 className="font-bold text-gray-900 font-serif">রোগী: {app.patientName}</h4>
                <p className="text-xs text-gray-600">সম্পর্ক: {app.patientRelation}</p>
                <p className="text-xs text-gray-800 mt-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {app.description}
                </p>
                <div className="mt-4 pt-3 border-t flex items-center justify-between">
                  <span className="text-sm font-extrabold text-rose-600 font-serif">
                    চাহিদা: {formatBDT(app.requestedAmount)}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setRecipientName(app.patientName);
                        setRelationship(app.patientRelation);
                        setReason('অসুস্থতা ও চিকিৎসা');
                        setDescription(app.description);
                        setAmount(app.requestedAmount);
                        setContactPhone(app.applicantPhone);
                        setIsDisburseModalOpen(true);
                      }}
                      className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg shadow-sm"
                    >
                      অনুমোদন ও সাহায্য প্রদান
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Disburse Aid Modal */}
      {isDisburseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsDisburseModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 font-serif mb-1">
              নতুন সাহায্য প্রদান লিপিবদ্ধ করুন (অ্যাডমিন)
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              কাকে সাহায্য করা হলো তা এখানে লিখে রাখলে সকল সদস্য তা স্বচ্ছভাবে দেখতে পারবেন।
            </p>

            <form onSubmit={handleDisburseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  কাকে সাহায্য করা হলো? (প্রাপকের নাম) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: করিম মোল্লা"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    পরিবারে সম্পর্ক *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: বড় চাচা"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    সাহায্যের কারণ *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none bg-white font-medium"
                  >
                    <option value="অসুস্থতা ও চিকিৎসা">অসুস্থতা ও চিকিৎসা</option>
                    <option value="জরুরি অপারেশন">জরুরি অপারেশন</option>
                    <option value="দুর্ঘটনা">দুর্ঘটনা</option>
                    <option value="আর্থিক সংকট">আর্থিক সংকট</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    প্রদত্ত সহায়তার পরিমাণ (টাকা) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-rose-700 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    প্রদানের তারিখ *
                  </label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  হাসপাতাল / ডাক্তারের নাম (যদি থাকে)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ঢাকা মেডিকেল কলেজ ও কার্ডিওলজি ইউনিট"
                  value={hospitalOrDoctor}
                  onChange={(e) => setHospitalOrDoctor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  অসুস্থতা বা বিপদের বিস্তারিত বিবরণ *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="যেমন: হার্টের জরুরি অপারেশনের জন্য হাসপাতালে ট্রাস্ট থেকে সরাসরি সহায়তা প্রদান করা হলো।"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsDisburseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-md"
                >
                  সাহায্য রেকর্ড করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Update Total Pool Modal */}
      {isPoolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 relative">
            <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">
              মোট ট্রাস্ট তহবিল সাইজ আপডেট
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              সকল সদস্যের অনুদান বৃদ্ধি পেলে মোট ট্রাস্ট ফান্ড আপডেট করুন।
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateTrustFundPool(Number(poolInput) || 0);
                setIsPoolModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  নতুন মোট তহবিল (টাকা)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={poolInput}
                  onChange={(e) => setPoolInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsPoolModalOpen(false)}
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
    </section>
  );
};
