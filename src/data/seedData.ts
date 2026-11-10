import {
  FamilyMember,
  ChandaMember,
  MonthlyPaymentRecord,
  EidEvent,
  AidRecord,
  UserProfile,
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'user-samiul',
  email: 'samiul122344@gmail.com',
  name: 'এমডি সামিউল ইসলাম',
  role: 'admin',
  phone: '০১৭১২-৩৪৫৬৭৮',
  photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  relation: 'পরিবার প্রধান ও ট্রাস্ট সমন্বয়ক',
  address: 'মোল্লা বাড়ি, দক্ষিণ পাড়া, ঢাকা',
};

// ১৫ জনের মাসিক চাঁদা তালিকা (৫০০ টাকা করে প্রতি মাসে) - নাম ও মোবাইল নম্বর পরিবর্তনযোগ্য
export const INITIAL_CHANDA_MEMBERS: ChandaMember[] = [
  { id: 1, name: 'এমডি সামিউল ইসলাম', fatherOrHusbandName: 'মজিবুর রহমান মোল্লা', phone: '০১৭১২-৩৪৫৬৭৮', monthlyAmount: 500, avatar: '👨‍💼' },
  { id: 2, name: 'আলহাজ্ব রফিকুল ইসলাম মোল্লা', fatherOrHusbandName: 'মরহুম আক্কাস মোল্লা', phone: '০১৭১১-২২৩৩৪৪', monthlyAmount: 500, avatar: '🧓' },
  { id: 3, name: 'শফিকুল ইসলাম মোল্লা', fatherOrHusbandName: 'মরহুম আক্কাস মোল্লা', phone: '০১৭২২-৩৩৪৪৫৫', monthlyAmount: 500, avatar: '👨' },
  { id: 4, name: 'মজিবুর রহমান মোল্লা', fatherOrHusbandName: 'মরহুম কাশেম মোল্লা', phone: '০১৭৩৩-৪৪৫৫৬৬', monthlyAmount: 500, avatar: '🧓' },
  { id: 5, name: 'তরিকুল ইসলাম মোল্লা', fatherOrHusbandName: 'রফিকুল ইসলাম মোল্লা', phone: '০১৭৪৪-৫৫৬৬৭৭', monthlyAmount: 500, avatar: '👨‍💻' },
  { id: 6, name: 'মাহবুব আলম মোল্লা', fatherOrHusbandName: 'শফিকুল ইসলাম মোল্লা', phone: '০১৭৫৫-৬৬৭৭৮৮', monthlyAmount: 500, avatar: '👨‍🔧' },
  { id: 7, name: 'জাহিদুল ইসলাম মোল্লা', fatherOrHusbandName: 'মজিবুর রহমান মোল্লা', phone: '০১৭৬৬-৭৭৮৮৯৯', monthlyAmount: 500, avatar: '👨‍🎓' },
  { id: 8, name: 'আনিসুর রহমান মোল্লা', fatherOrHusbandName: 'মরহুম কাশেম মোল্লা', phone: '০১৭৭৭-৮৮৯৯০০', monthlyAmount: 500, avatar: '👨‍🌾' },
  { id: 9, name: 'কামরুল হাসান মোল্লা', fatherOrHusbandName: 'আনিসুর রহমান মোল্লা', phone: '০১৭৮৮-৯৯০০১১', monthlyAmount: 500, avatar: '👨‍🏫' },
  { id: 10, name: 'মাসুদ রানা মোল্লা', fatherOrHusbandName: 'রফিকুল ইসলাম মোল্লা', phone: '০১৭৯৯-০০১১২২', monthlyAmount: 500, avatar: '👨‍🍳' },
  { id: 11, name: 'ফারুক হোসেন মোল্লা', fatherOrHusbandName: 'শফিকুল ইসলাম মোল্লা', phone: '০১৮১১-২২৩৩৪৪', monthlyAmount: 500, avatar: '👨‍✈️' },
  { id: 12, name: 'নাসির উদ্দিন মোল্লা', fatherOrHusbandName: 'মরহুম ইদ্রিস মোল্লা', phone: '০১৮২২-৩৩৪৪৫৫', monthlyAmount: 500, avatar: '👨‍⚖️' },
  { id: 13, name: 'আরিফুল ইসলাম মোল্লা', fatherOrHusbandName: 'নাসির উদ্দিন মোল্লা', phone: '০১৮৩৩-৪৪৫৫৬৬', monthlyAmount: 500, avatar: '👨‍🔬' },
  { id: 14, name: 'সাইফুল ইসলাম মোল্লা', fatherOrHusbandName: 'মরহুম আক্কাস মোল্লা', phone: '০১৮৪৪-৫৫৬৬৭৭', monthlyAmount: 500, avatar: '👨‍💼' },
  { id: 15, name: 'তানভীর আহমেদ মোল্লা', fatherOrHusbandName: 'সাইফুল ইসলাম মোল্লা', phone: '০১৮৫৫-৬৬৭৭৮৮', monthlyAmount: 500, avatar: '👨‍🎓' },
];

// মাসিক চাঁদা পরিশোধের রেকর্ড (সদস্যরা বা অ্যাডমিন টাকা পরিশোধ চিহ্নিত করলে স্বয়ংক্রিয়ভাবে ব্যালেন্সে যোগ হবে)
export const INITIAL_MONTHLY_PAYMENTS: MonthlyPaymentRecord[] = [];

// পরিবারের সদস্য তালিকা (ব্যবহারকারীরা যখন যুক্ত করবে তখন এখানে সাথে সাথে শো করবে)
export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [];

// ঈদুল ফিতর ও ঈদুল আজহা অনুষ্ঠান (ব্যবহারকারী নিজে জিনিসপাতি ও খরচ লিখে দিলে তা এখানে সাথে সাথে প্রদর্শিত হবে)
export const INITIAL_EID_EVENTS: EidEvent[] = [
  {
    id: 'eid-ul-fitr',
    title: 'পবিত্র ঈদুল ফিতর ২০২৬ পারিবারিক পুনর্মিলনী ও ভোজ',
    subTitle: 'মোল্লা পরিবারের সকল সদস্যদের একত্রীকরণ ও আনন্দ উদযাপন',
    year: 2026,
    date: '২০২৬-০৩-২১',
    cashInHand: 0,
    totalCollected: 0,
    estimatedBudget: 0,
    status: 'upcoming',
    notes: 'ঈদের অনুষ্ঠান ও যাবতীয় খরচ লিখে যুক্ত করার জন্য প্রস্তুত।',
    expenses: [],
  },
  {
    id: 'eid-ul-adha',
    title: 'পবিত্র ঈদুল আজহা ২০২৬ যৌথ কোরবানি ও আপ্যায়ন',
    subTitle: 'পরিবারের যৌথ কোরবানি, গোশত বণ্টন ও সান্ধ্যকালীন ভোজসভা',
    year: 2026,
    date: '২০২৬-০৫-২৮',
    cashInHand: 0,
    totalCollected: 0,
    estimatedBudget: 0,
    status: 'upcoming',
    notes: 'কোরবানি ও অনুষ্ঠানের খরচের তালিকা লিখে যুক্ত করার জন্য প্রস্তুত।',
    expenses: [],
  },
];

// মোল্লা পরিবার কল্যাণ ট্রাস্ট (অসুস্থতা, চিকিৎসা ও আপৎকালীন সহায়তা রেকর্ড)
export const INITIAL_AID_RECORDS: AidRecord[] = [];

export const INITIAL_BASE_RESERVE = 25000;

export const INITIAL_TRUST_SUMMARY = {
  totalFundPool: 25000,
  totalDisbursed: 0,
};

