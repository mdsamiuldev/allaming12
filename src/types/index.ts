export type Role = 'admin' | 'member';

export type Gender = 'male' | 'female';
export type AgeCategory = 'child' | 'adult';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string;
  photoUrl: string;
  relation: string;
  address: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  gender: Gender;
  ageCategory: AgeCategory;
  age: number;
  relationship: string;
  livesHere: boolean; // কারা কারা বসবাস করে
  residenceDetail: string;
  occupation: string;
  phone?: string;
  bloodGroup?: string;
  photoUrl?: string;
  notes?: string;
  createdByEmail?: string; // যে সদস্য এটি যুক্ত করেছে তার জিমেইল
  createdByName?: string;
  createdById?: string;
  createdAt?: string;
}

export interface ChandaMember {
  id: number; // 1 to 15
  name: string;
  fatherOrHusbandName: string;
  phone: string;
  monthlyAmount: number; // 500 BDT
  avatar: string;
}

export interface MonthlyPaymentRecord {
  memberId: number;
  month: string; // e.g. "2026-01"
  isPaid: boolean;
  amount: number;
  paidDate?: string;
  receivedBy?: string;
  paymentMethod?: string;
  note?: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  category: 'খাবার' | 'ডেকোরেশন' | 'সালামি ও উপহার' | 'কোরবানি ও কসাই' | 'অন্যান্য';
  estimatedCost: number;
  actualCost: number;
  purchasedBy?: string;
  receiptNo?: string;
  isCompleted: boolean;
}

export interface EidEvent {
  id: 'eid-ul-fitr' | 'eid-ul-adha';
  title: string;
  subTitle: string;
  year: number;
  date: string;
  cashInHand: number; // কত টাকা হাতে আছে (অ্যাডমিন আপডেট)
  totalCollected: number; // কত টাকা উঠেছে (অ্যাডমিন আপডেট)
  estimatedBudget: number; // আনুমানিক কত টাকা লাগতে পারে
  expenses: ExpenseItem[];
  status: 'upcoming' | 'ongoing' | 'completed';
  notes?: string;
}

export interface AidRecord {
  id: string;
  recipientName: string;
  relationship: string;
  reason: 'অসুস্থতা ও চিকিৎসা' | 'জরুরি অপারেশন' | 'দুর্ঘটনা' | 'আর্থিক সংকট' | 'অন্যান্য';
  description: string;
  amount: number;
  date: string;
  approvedBy: string;
  hospitalOrDoctor?: string;
  status: 'অনুমোদিত ও প্রদানকৃত' | 'প্রক্রিয়াধীন';
  contactPhone?: string;
}

export interface AidApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  patientName: string;
  patientRelation: string;
  reason: string;
  requestedAmount: number;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface TrustFundSummary {
  totalFundPool: number;
  totalDisbursed: number;
  monthlyDonationCollected: number;
  emergencyReserve: number;
}
