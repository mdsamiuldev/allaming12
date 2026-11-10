import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FamilyMember, Gender, AgeCategory } from '../types';
import { calculateFamilyStats, filterFamilyMembers } from '../utils/familyStats';
import { toBengaliNumber } from '../utils/financeStats';
import {
  Users,
  UserPlus,
  Home,
  Briefcase,
  Phone,
  Search,
  Filter,
  Trash2,
  Edit2,
  X,
  Check,
  MapPin,
  Heart,
  Droplet,
  Baby,
  UserCheck,
} from 'lucide-react';

interface FamilySectionProps {
  onOpenLogin: () => void;
}

export const FamilySection: React.FC<FamilySectionProps> = ({ onOpenLogin }) => {
  const { familyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember, isAdmin, currentUser } =
    useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLiving, setFilterLiving] = useState<'all' | 'resident' | 'non-resident'>('all');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
  const [filterAge, setFilterAge] = useState<'all' | 'child' | 'adult'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('adult');
  const [age, setAge] = useState<number>(25);
  const [relationship, setRelationship] = useState('');
  const [livesHere, setLivesHere] = useState<boolean>(true);
  const [residenceDetail, setResidenceDetail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  const stats = calculateFamilyStats(familyMembers);

  const filteredMembers = filterFamilyMembers(
    familyMembers,
    searchQuery,
    filterLiving,
    filterGender,
    filterAge
  );

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setGender('male');
    setAgeCategory('adult');
    setAge(25);
    setRelationship('');
    setLivesHere(true);
    setResidenceDetail('মোল্লা বাড়ি');
    setOccupation('');
    setPhone('');
    setBloodGroup('');
    setIsModalOpen(true);
  };

  const openEditModal = (member: FamilyMember) => {
    setEditingMember(member);
    setName(member.name);
    setGender(member.gender);
    setAgeCategory(member.ageCategory);
    setAge(member.age);
    setRelationship(member.relationship);
    setLivesHere(member.livesHere);
    setResidenceDetail(member.residenceDetail);
    setOccupation(member.occupation);
    setPhone(member.phone || '');
    setBloodGroup(member.bloodGroup || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      gender,
      ageCategory,
      age: Number(age) || 0,
      relationship: relationship.trim() || 'পারিবারিক সদস্য',
      livesHere,
      residenceDetail: residenceDetail.trim() || (livesHere ? 'মোল্লা বাড়ি' : 'অন্যত্র'),
      occupation: occupation.trim() || 'অন্যান্য',
      phone: phone.trim(),
      bloodGroup: bloodGroup.trim(),
    };

    if (editingMember) {
      updateFamilyMember(editingMember.id, payload);
    } else {
      addFamilyMember(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>মোল্লা পরিবারের বংশলতিকা ও সদস্য বিবরণী</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-white">
              পরিবারের সদস্য ও বসবাসকারী
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              আমাদের মোল্লা পরিবারের সকল সদস্য, ছেলে ও মেয়েদের সংখ্যা, ছোট ও বড়দের বিবরণ এবং কারা একসাথে
              বসবাস করে তার সম্পূর্ণ হালনাগাদ তথ্যভাণ্ডার।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold px-5 py-3 rounded-2xl shadow-lg transition-all duration-200 text-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>নতুন সদস্য যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Requirements Demographic KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-8 pt-6 border-t border-emerald-700/60">
          {/* Total Members */}
          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block">
              মোট সদস্য
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif block mt-0.5">
              {toBengaliNumber(stats.totalMembers)} জন
            </span>
            <span className="text-[10px] text-emerald-300/80">নিবন্ধিত সদস্য</span>
          </div>

          {/* Male Members (ছেলে কয়জন) */}
          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider block flex items-center justify-center gap-1">
              <span>ছেলে সদস্য</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-serif block mt-0.5">
              {toBengaliNumber(stats.maleCount)} জন
            </span>
            <span className="text-[10px] text-sky-200/80">পুরুষ সদস্যবৃন্দ</span>
          </div>

          {/* Female Members (মেয়ে কয়জন) */}
          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider block flex items-center justify-center gap-1">
              <span>মেয়ে সদস্য</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-serif block mt-0.5">
              {toBengaliNumber(stats.femaleCount)} জন
            </span>
            <span className="text-[10px] text-rose-200/80">নারী সদস্যবৃন্দ</span>
          </div>

          {/* Children (ছোট কয়জন) */}
          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider block flex items-center justify-center gap-1">
              <Baby className="w-3.5 h-3.5 inline text-purple-300" />
              <span>ছোট সদস্য</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-serif block mt-0.5">
              {toBengaliNumber(stats.childrenCount)} জন
            </span>
            <span className="text-[10px] text-purple-200/80">১৮ বছরের নিচে</span>
          </div>

          {/* Adults (বড় কয়জন) */}
          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider block">
              বড় সদস্য
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif block mt-0.5">
              {toBengaliNumber(stats.adultCount)} জন
            </span>
            <span className="text-[10px] text-amber-200/80">১৮ বছর বা তদূর্ধ্ব</span>
          </div>

          {/* Residents (কারা কারা বসবাস করে) */}
          <div className="bg-emerald-950/60 border border-emerald-500/60 rounded-2xl p-3.5 text-center bg-gradient-to-b from-emerald-900/60 to-emerald-950/90 shadow-md">
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block flex items-center justify-center gap-1">
              <Home className="w-3.5 h-3.5 inline text-emerald-300" />
              <span>কারা বসবাস করে</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-serif block mt-0.5">
              {toBengaliNumber(stats.residentCount)} জন
            </span>
            <span className="text-[10px] text-emerald-200/80">মোল্লা বাড়িতে বসবাসকারী</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-100 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নাম, সম্পর্ক, পেশা বা থাকার জায়গা দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Living status filter */}
          <select
            value={filterLiving}
            onChange={(e) => setFilterLiving(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:border-emerald-500 focus:outline-none"
          >
            <option value="all">বসবাস: সকল সদস্য</option>
            <option value="resident">🏠 শুধু বসবাসকারী ({toBengaliNumber(stats.residentCount)} জন)</option>
            <option value="non-resident">✈️ অন্যত্র / প্রবাসী ({toBengaliNumber(stats.nonResidentCount)} জন)</option>
          </select>

          {/* Gender Filter */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:border-emerald-500 focus:outline-none"
          >
            <option value="all">লিঙ্গ: সকল</option>
            <option value="male">ছেলে সদস্য ({toBengaliNumber(stats.maleCount)})</option>
            <option value="female">মেয়ে সদস্য ({toBengaliNumber(stats.femaleCount)})</option>
          </select>

          {/* Age Category Filter */}
          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:border-emerald-500 focus:outline-none"
          >
            <option value="all">বয়স: সকল</option>
            <option value="child">ছোট সদস্য ({toBengaliNumber(stats.childrenCount)})</option>
            <option value="adult">বড় সদস্য ({toBengaliNumber(stats.adultCount)})</option>
          </select>

          {(searchQuery || filterLiving !== 'all' || filterGender !== 'all' || filterAge !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterLiving('all');
                setFilterGender('all');
                setFilterAge('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1.5"
            >
              রিসেট
            </button>
          )}
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className={`rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg bg-white relative flex flex-col justify-between ${
              member.livesHere
                ? 'border-emerald-200/80 hover:border-emerald-400'
                : 'border-sky-200/80 hover:border-sky-400 bg-gradient-to-b from-white to-sky-50/20'
            }`}
          >
            {/* Top Badges */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Living Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      member.livesHere
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-sky-100 text-sky-800 border border-sky-200'
                    }`}
                  >
                    <Home className="w-3 h-3" />
                    <span>{member.livesHere ? 'একসাথে বসবাসকারী' : 'অন্যত্র / প্রবাসী'}</span>
                  </span>

                  {/* Gender Badge */}
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      member.gender === 'male'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {member.gender === 'male' ? 'ছেলে' : 'মেয়ে'}
                  </span>

                  {/* Age Category Badge */}
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      member.ageCategory === 'child'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {member.ageCategory === 'child' ? 'ছোট' : 'বড়'} ({toBengaliNumber(member.age)} বছর)
                  </span>
                </div>

                {/* Blood Group */}
                {member.bloodGroup && (
                  <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200 flex items-center gap-0.5">
                    <Droplet className="w-2.5 h-2.5 fill-red-600 text-red-600" />
                    {member.bloodGroup}
                  </span>
                )}
              </div>

              {/* Member Name & Relation */}
              <div className="flex items-start gap-3 mt-2">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 shadow-sm ${
                    member.gender === 'male'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  {member.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-tight font-serif">
                    {member.name}
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-emerald-600" />
                    <span>সম্পর্ক: {member.relationship}</span>
                  </p>
                </div>
              </div>

              {/* Residence & Living Place - Highlights কারা কারা বসবাস করে */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-start gap-2 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-700 block text-[11px]">
                      বসবাসের বিস্তারিত অবস্থান:
                    </span>
                    <span className="text-gray-900 font-medium">{member.residenceDetail}</span>
                  </div>
                </div>

                {member.occupation && (
                  <div className="flex items-center gap-2 text-gray-600 px-1">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">পেশা/শিক্ষা: {member.occupation}</span>
                  </div>
                )}

                {member.phone && (
                  <div className="flex items-center gap-2 text-gray-600 px-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <a href={`tel:${member.phone}`} className="hover:text-emerald-700 font-mono">
                      {member.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Actions for Admin */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-400 font-mono">
                আইডি: #{member.id.replace('f-', '')}
              </span>

              {isAdmin ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="সম্পাদনা করুন"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`আপনি কি সত্যিই "${member.name}" কে তালিকা থেকে মুছে ফেলতে চান?`)) {
                        deleteFamilyMember(member.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>পরিবারের সদস্য</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {familyMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border-2 border-dashed border-emerald-200/80 shadow-sm max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Users className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 font-serif">
              পরিবারে এখনো কোনো সদস্য যোগ করা হয়নি
            </h4>
            <p className="text-xs text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              সদস্য অ্যাড করার অপশন প্রস্তুত আছে। নিচে অথবা ওপরের বাটনে চাপ দিয়ে পরিবারের ছেলে, মেয়ে,
              ছোট, বড় এবং একসাথে বসবাসকারী সদস্যদের যোগ করুন। সদস্য অ্যাড করলেই সাথে সাথে এখানে বিস্তারিত শো করবে।
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold px-6 py-3 rounded-2xl shadow-md transition-all text-sm hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ নতুন সদস্য যোগ করুন</span>
          </button>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-gray-700 font-serif">কোনো সদস্য পাওয়া যায়নি</h4>
          <p className="text-xs text-gray-500 mt-1">আপনার ফিল্টার বা অনুসন্ধানের শব্দ পরিবর্তন করে চেষ্টা করুন।</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterLiving('all');
              setFilterGender('all');
              setFilterAge('all');
            }}
            className="mt-4 text-xs font-bold text-emerald-700 hover:underline"
          >
            সকল ফিল্টার মুছুন
          </button>
        </div>
      ) : null}

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 font-serif">
                {editingMember ? 'সদস্যের তথ্য সম্পাদনা' : 'পরিবারে নতুন সদস্য যোগ করুন'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                মোল্লা পরিবারের সদস্যের নাম, ছেলে/মেয়ে, বয়স, বাসস্থান ইত্যাদির তথ্য দিন।
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  সদস্যের পুরো নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোহাম্মদ কামরুল ইসলাম মোল্লা"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
                />
              </div>

              {/* Gender & Age Category Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ছেলে নাকি মেয়ে? (লিঙ্গ) *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="male">ছেলে সদস্য (পুরুষ)</option>
                    <option value="female">মেয়ে সদস্য (নারী)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ছোট নাকি বড়? *
                  </label>
                  <select
                    value={ageCategory}
                    onChange={(e) => setAgeCategory(e.target.value as AgeCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="child">ছোট সদস্য (১৮ বছরের কম)</option>
                    <option value="adult">বড় সদস্য (১৮ বছর বা বেশি)</option>
                  </select>
                </div>
              </div>

              {/* Age & Relationship */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    বয়স (বছর) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    required
                    value={age}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAge(val);
                      if (val < 18) setAgeCategory('child');
                      else setAgeCategory('adult');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    পরিবারে সম্পর্ক *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: পিতা, ভাই, ভাতিজা, বোন"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Residence Requirement: কারা কারা বসবাস করে */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
                <label className="block text-xs font-bold text-emerald-950 mb-2">
                  বসবাসের অবস্থান (কারা কারা একসাথে বসবাস করে) *
                </label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setLivesHere(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      livesHere
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>একসাথে বসবাস করে</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLivesHere(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      !livesHere
                        ? 'bg-sky-700 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>অন্যত্র / প্রবাসী</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-900 mb-1">
                    বসবাসের স্থান বা ঠিকানার বিস্তারিত:
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মূল মোল্লা বাড়ি (দক্ষিণ ভিটা) অথবা কানাডা প্রবাসী"
                    value={residenceDetail}
                    onChange={(e) => setResidenceDetail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Occupation & Blood Group */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    পেশা বা শিক্ষা
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ব্যবসায়ী, শিক্ষার্থী"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    রক্তের গ্রুপ
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none bg-white font-mono"
                  >
                    <option value="">জানা নেই</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  মোবাইল নম্বর (যদি থাকে)
                </label>
                <input
                  type="tel"
                  placeholder="০১৭১১-XXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-md"
                >
                  {editingMember ? 'সংরক্ষণ করুন' : 'সদস্য যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
