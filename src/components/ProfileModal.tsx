import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Phone, MapPin, Heart, Shield, Check, Mail } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddMember?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAddMember,
}) => {
  const { currentUser, updateUserProfile, isAdmin, familyMembers } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [relation, setRelation] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setRelation(currentUser.relation || '');
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      address,
      relation,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="relative">
            <img
              src={currentUser.photoUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-md"
            />
            <span
              className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isAdmin
                  ? 'bg-amber-500 text-emerald-950 ring-2 ring-white'
                  : 'bg-emerald-600 text-white ring-2 ring-white'
              }`}
            >
              {isAdmin ? 'অ্যাডমিন' : 'সদস্য'}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">{currentUser.name}</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              {currentUser.email}
            </p>
            <p className="text-xs text-emerald-700 font-medium mt-1">
              মোল্লা পরিবার সদস্য আইডি: #{currentUser.id.slice(-6)}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>আপনার প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              আপনার নাম *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              মোবাইল নম্বর
            </label>
            <input
              type="tel"
              placeholder="০১৭১২-৩৪৫৬৭৮"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-600" />
              পরিবারে আপনার ভূমিকা / সম্পর্ক
            </label>
            <input
              type="text"
              placeholder="যেমন: বড় ভাই / সন্তান / নাতি"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              বর্তমান ঠিকানা ও বসবাসের স্থান
            </label>
            <input
              type="text"
              placeholder="যেমন: মোল্লা বাড়ি (মূল ভবন), ঢাকা"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none"
            />
          </div>

          {/* Quick link to add family member if requested */}
          {onOpenAddMember && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 mt-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  পরিবারের নতুন সদস্য যুক্ত করবেন?
                </p>
                <p className="text-[11px] text-emerald-700">
                  বর্তমানে মোট সদস্য সংখ্যা: {familyMembers.length} জন
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddMember();
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
              >
                + সদস্য যোগ করুন
              </button>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-md transition-all"
            >
              প্রোফাইল সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
