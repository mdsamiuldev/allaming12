import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  FamilyMember,
  ChandaMember,
  MonthlyPaymentRecord,
  EidEvent,
  AidRecord,
  AidApplication,
  ExpenseItem,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_CHANDA_MEMBERS,
  INITIAL_MONTHLY_PAYMENTS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_EID_EVENTS,
  INITIAL_AID_RECORDS,
  INITIAL_TRUST_SUMMARY,
  INITIAL_BASE_RESERVE,
} from '../data/seedData';
import { canUserManageMember } from '../utils/familyStats';
import { calculateLiveFundBalance, LiveFundSummary } from '../utils/financeStats';

interface AppContextType {
  // User & Auth
  currentUser: UserProfile | null;
  isAdmin: boolean;
  loginWithGoogle: (email: string, name?: string, photo?: string) => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  toggleAdminMode: () => void;

  // Family Members
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMember: (id: string, member: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;
  canEditMember: (member: FamilyMember) => boolean;

  // Monthly Chanda (No limit on members)
  chandaMembers: ChandaMember[];
  addChandaMember: (data: {
    name: string;
    fatherOrHusbandName?: string;
    phone?: string;
    monthlyAmount?: number;
    markPaidForMonth?: string;
    note?: string;
  }) => void;
  deleteChandaMember: (id: number) => void;
  updateChandaMember: (
    id: number,
    data: { name: string; fatherOrHusbandName?: string; phone?: string; monthlyAmount?: number }
  ) => void;
  monthlyPayments: MonthlyPaymentRecord[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  togglePaymentStatus: (memberId: number, month: string, note?: string) => void;
  updatePaymentRecord: (record: MonthlyPaymentRecord) => void;

  // Live Auto-calculated Balance & Trust Fund
  baseOpeningFund: number;
  updateBaseOpeningFund: (amount: number) => void;
  totalCurrentBalance: number;
  liveFundSummary: LiveFundSummary;
  trustFundPool: number;
  aidRecords: AidRecord[];
  aidApplications: AidApplication[];
  addAidRecord: (record: Omit<AidRecord, 'id'>) => void;
  updateAidRecord: (id: string, record: Partial<AidRecord>) => void;
  deleteAidRecord: (id: string) => void;
  submitAidApplication: (app: Omit<AidApplication, 'id' | 'date' | 'status'>) => void;
  updateTrustFundPool: (amount: number) => void;

  // Eid Events (Fitr & Adha)
  eidEvents: EidEvent[];
  updateEventFinances: (
    eventId: 'eid-ul-fitr' | 'eid-ul-adha',
    data: { cashInHand: number; totalCollected: number; estimatedBudget?: number; notes?: string }
  ) => void;
  addExpenseItem: (eventId: 'eid-ul-fitr' | 'eid-ul-adha', item: Omit<ExpenseItem, 'id'>) => void;
  updateExpenseItem: (eventId: 'eid-ul-fitr' | 'eid-ul-adha', itemId: string, item: Partial<ExpenseItem>) => void;
  deleteExpenseItem: (eventId: 'eid-ul-fitr' | 'eid-ul-adha', itemId: string) => void;

  // System
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'molla_user_v4',
  FAMILY: 'molla_family_v4',
  CHANDA_MEMBERS: 'molla_chanda_members_v4',
  CHANDA_PAYMENTS: 'molla_chanda_payments_v4',
  EID_EVENTS: 'molla_eid_events_v4',
  AID_RECORDS: 'molla_aid_records_v4',
  BASE_FUND: 'molla_base_fund_v4',
  AID_APPS: 'molla_aid_apps_v4',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load storage for ' + key, e);
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    loadStorage<UserProfile | null>(STORAGE_KEYS.USER, INITIAL_USER)
  );

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() =>
    loadStorage<FamilyMember[]>(STORAGE_KEYS.FAMILY, INITIAL_FAMILY_MEMBERS)
  );

  const [chandaMembers, setChandaMembers] = useState<ChandaMember[]>(() =>
    loadStorage<ChandaMember[]>(STORAGE_KEYS.CHANDA_MEMBERS, INITIAL_CHANDA_MEMBERS)
  );

  const [monthlyPayments, setMonthlyPayments] = useState<MonthlyPaymentRecord[]>(() =>
    loadStorage<MonthlyPaymentRecord[]>(STORAGE_KEYS.CHANDA_PAYMENTS, INITIAL_MONTHLY_PAYMENTS)
  );

  const [selectedMonth, setSelectedMonth] = useState<string>('2026-02');

  const [eidEvents, setEidEvents] = useState<EidEvent[]>(() =>
    loadStorage<EidEvent[]>(STORAGE_KEYS.EID_EVENTS, INITIAL_EID_EVENTS)
  );

  const [baseOpeningFund, setBaseOpeningFund] = useState<number>(() =>
    loadStorage<number>(STORAGE_KEYS.BASE_FUND, INITIAL_BASE_RESERVE)
  );

  const [aidRecords, setAidRecords] = useState<AidRecord[]>(() =>
    loadStorage<AidRecord[]>(STORAGE_KEYS.AID_RECORDS, INITIAL_AID_RECORDS)
  );

  const [aidApplications, setAidApplications] = useState<AidApplication[]>(() =>
    loadStorage<AidApplication[]>(STORAGE_KEYS.AID_APPS, [])
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHANDA_MEMBERS, JSON.stringify(chandaMembers));
  }, [chandaMembers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHANDA_PAYMENTS, JSON.stringify(monthlyPayments));
  }, [monthlyPayments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EID_EVENTS, JSON.stringify(eidEvents));
  }, [eidEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AID_RECORDS, JSON.stringify(aidRecords));
  }, [aidRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BASE_FUND, JSON.stringify(baseOpeningFund));
  }, [baseOpeningFund]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AID_APPS, JSON.stringify(aidApplications));
  }, [aidApplications]);

  // Dynamic automatic fund calculation: Base Opening Reserve + Paid Monthly Chanda - Disbursed Aid
  const liveFundSummary = calculateLiveFundBalance(baseOpeningFund, monthlyPayments, aidRecords);
  const totalCurrentBalance = liveFundSummary.currentBalance;
  const trustFundPool = totalCurrentBalance;

  const isAdmin = currentUser?.role === 'admin';

  // Login handler
  const loginWithGoogle = (email: string, name?: string, photo?: string) => {
    const isOwner = email.toLowerCase().trim() === 'samiul122344@gmail.com';
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: email.trim(),
      name: name || (isOwner ? 'এমডি সামিউল ইসলাম' : email.split('@')[0]),
      role: isOwner ? 'admin' : 'member',
      phone: isOwner ? '০১৭১২-৩৪৫৬৭৮' : '',
      photoUrl: photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      relation: isOwner ? 'পরিবার প্রধান ও ট্রাস্ট সমন্বয়ক' : 'পারিবারিক সদস্য',
      address: 'মোল্লা বাড়ি',
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...profile });
  };

  const toggleAdminMode = () => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      role: currentUser.role === 'admin' ? 'member' : 'admin',
    });
  };

  // Family Members CRUD with Creator-Based Ownership
  const canEditMember = (member: FamilyMember): boolean => {
    return canUserManageMember(member, currentUser?.email);
  };

  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const creatorEmail = currentUser?.email?.trim() || 'guest@molla.family';
    const creatorName =
      currentUser?.name?.trim() ||
      (currentUser?.email ? currentUser.email.split('@')[0] : 'অজ্ঞাত সদস্য');

    const newMember: FamilyMember = {
      ...member,
      id: `f-${Date.now()}`,
      createdByEmail: member.createdByEmail || creatorEmail,
      createdByName: member.createdByName || creatorName,
      createdById: member.createdById || currentUser?.id || 'guest',
      createdAt: member.createdAt || new Date().toISOString(),
    };
    setFamilyMembers((prev) => [newMember, ...prev]);
  };

  const updateFamilyMember = (id: string, updatedData: Partial<FamilyMember>) => {
    setFamilyMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        // Verify ownership: only creator or master admin can update
        const allowed = canUserManageMember(m, currentUser?.email);
        if (!allowed) {
          console.warn('Unauthorized update attempt on member:', id);
          return m;
        }
        return { ...m, ...updatedData };
      })
    );
  };

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers((prev) =>
      prev.filter((m) => {
        if (m.id !== id) return true;
        // Verify ownership: only creator or master admin can delete
        const allowed = canUserManageMember(m, currentUser?.email);
        if (!allowed) {
          console.warn('Unauthorized delete attempt on member:', id);
          return true; // do not delete
        }
        return false;
      })
    );
  };

  // Chanda Members CRUD (No 15-person limit)
  const addChandaMember = (data: {
    name: string;
    fatherOrHusbandName?: string;
    phone?: string;
    monthlyAmount?: number;
    markPaidForMonth?: string;
    note?: string;
  }) => {
    if (!isAdmin) return;
    const newId = (chandaMembers.length > 0 ? Math.max(...chandaMembers.map((m) => m.id)) : 0) + 1;
    const monthlyAmount = Number(data.monthlyAmount) || 500;
    const newMember: ChandaMember = {
      id: newId,
      name: data.name.trim(),
      fatherOrHusbandName: data.fatherOrHusbandName?.trim() || '',
      phone: data.phone?.trim() || '',
      monthlyAmount,
      avatar: '👤',
    };
    setChandaMembers((prev) => [...prev, newMember]);

    if (data.markPaidForMonth) {
      const todayBn = new Date().toLocaleDateString('bn-BD');
      setMonthlyPayments((prev) => [
        ...prev.filter((p) => !(p.memberId === newId && p.month === data.markPaidForMonth)),
        {
          memberId: newId,
          month: data.markPaidForMonth!,
          isPaid: true,
          amount: monthlyAmount,
          paidDate: todayBn,
          note: data.note || 'পরিশোধিত',
        },
      ]);
    }
  };

  const deleteChandaMember = (id: number) => {
    if (!isAdmin) return;
    setChandaMembers((prev) => prev.filter((m) => m.id !== id));
    setMonthlyPayments((prev) => prev.filter((p) => p.memberId !== id));
  };

  const updateChandaMember = (
    id: number,
    data: { name: string; fatherOrHusbandName?: string; phone?: string; monthlyAmount?: number }
  ) => {
    if (!isAdmin) return;
    setChandaMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              name: data.name.trim() || m.name,
              fatherOrHusbandName:
                data.fatherOrHusbandName !== undefined
                  ? data.fatherOrHusbandName.trim()
                  : m.fatherOrHusbandName,
              phone: data.phone !== undefined ? data.phone.trim() : m.phone,
              monthlyAmount:
                data.monthlyAmount !== undefined ? Number(data.monthlyAmount) : m.monthlyAmount,
            }
          : m
      )
    );
  };

  // Monthly Chanda Toggles - auto updates balance immediately
  const togglePaymentStatus = (memberId: number, month: string, note?: string) => {
    if (!isAdmin) return;
    const member = chandaMembers.find((m) => m.id === memberId);
    const defaultAmount = member ? member.monthlyAmount : 500;

    setMonthlyPayments((prev) => {
      const existingIndex = prev.findIndex((r) => r.memberId === memberId && r.month === month);
      const todayBn = new Date().toLocaleDateString('bn-BD');

      if (existingIndex >= 0) {
        const item = prev[existingIndex];
        const nextPaid = !item.isPaid;
        const updated = [...prev];
        updated[existingIndex] = {
          ...item,
          isPaid: nextPaid,
          amount: nextPaid ? (item.amount || defaultAmount) : 0,
          paidDate: nextPaid ? todayBn : undefined,
          note: note !== undefined ? note : (nextPaid ? 'পরিশোধিত' : 'বকেয়া'),
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            memberId,
            month,
            isPaid: true,
            amount: defaultAmount,
            paidDate: todayBn,
            note: note || 'পরিশোধিত',
          },
        ];
      }
    });
  };

  const updatePaymentRecord = (record: MonthlyPaymentRecord) => {
    if (!isAdmin) return;
    setMonthlyPayments((prev) => {
      const idx = prev.findIndex((r) => r.memberId === record.memberId && r.month === record.month);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = record;
        return next;
      }
      return [...prev, record];
    });
  };

  const updateBaseOpeningFund = (amount: number) => {
    if (!isAdmin) return;
    setBaseOpeningFund(amount);
  };

  // Eid Events
  const updateEventFinances = (
    eventId: 'eid-ul-fitr' | 'eid-ul-adha',
    data: { cashInHand: number; totalCollected: number; estimatedBudget?: number; notes?: string }
  ) => {
    if (!isAdmin) return;
    setEidEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            cashInHand: data.cashInHand,
            totalCollected: data.totalCollected,
            estimatedBudget: data.estimatedBudget !== undefined ? data.estimatedBudget : e.estimatedBudget,
            notes: data.notes !== undefined ? data.notes : e.notes,
          };
        }
        return e;
      })
    );
  };

  const addExpenseItem = (eventId: 'eid-ul-fitr' | 'eid-ul-adha', item: Omit<ExpenseItem, 'id'>) => {
    if (!isAdmin) return;
    const newItem: ExpenseItem = {
      ...item,
      id: `exp-${Date.now()}`,
    };
    setEidEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, expenses: [newItem, ...e.expenses] } : e))
    );
  };

  const updateExpenseItem = (
    eventId: 'eid-ul-fitr' | 'eid-ul-adha',
    itemId: string,
    item: Partial<ExpenseItem>
  ) => {
    if (!isAdmin) return;
    setEidEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            expenses: e.expenses.map((x) => (x.id === itemId ? { ...x, ...item } : x)),
          };
        }
        return e;
      })
    );
  };

  const deleteExpenseItem = (eventId: 'eid-ul-fitr' | 'eid-ul-adha', itemId: string) => {
    if (!isAdmin) return;
    setEidEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            expenses: e.expenses.filter((x) => x.id !== itemId),
          };
        }
        return e;
      })
    );
  };

  // Trust Fund
  const addAidRecord = (record: Omit<AidRecord, 'id'>) => {
    if (!isAdmin) return;
    const newRecord: AidRecord = {
      ...record,
      id: `aid-${Date.now()}`,
    };
    setAidRecords((prev) => [newRecord, ...prev]);
  };

  const updateAidRecord = (id: string, record: Partial<AidRecord>) => {
    if (!isAdmin) return;
    setAidRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...record } : r)));
  };

  const deleteAidRecord = (id: string) => {
    if (!isAdmin) return;
    setAidRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const submitAidApplication = (app: Omit<AidApplication, 'id' | 'date' | 'status'>) => {
    const newApp: AidApplication = {
      ...app,
      id: `app-${Date.now()}`,
      date: new Date().toLocaleDateString('bn-BD'),
      status: 'pending',
    };
    setAidApplications((prev) => [newApp, ...prev]);
  };

  const updateTrustFundPool = (amount: number) => {
    if (!isAdmin) return;
    const chandaCollected = liveFundSummary.totalChandaCollected;
    const aidDisbursed = liveFundSummary.totalAidDisbursed;
    setBaseOpeningFund(Math.max(0, amount - chandaCollected + aidDisbursed));
  };

  const resetAllData = () => {
    setCurrentUser(INITIAL_USER);
    setFamilyMembers(INITIAL_FAMILY_MEMBERS);
    setMonthlyPayments(INITIAL_MONTHLY_PAYMENTS);
    setEidEvents(INITIAL_EID_EVENTS);
    setBaseOpeningFund(INITIAL_BASE_RESERVE);
    setAidRecords(INITIAL_AID_RECORDS);
    setAidApplications([]);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAdmin,
        loginWithGoogle,
        logout,
        updateUserProfile,
        toggleAdminMode,
        familyMembers,
        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        canEditMember,
        chandaMembers,
        addChandaMember,
        deleteChandaMember,
        updateChandaMember,
        monthlyPayments,
        selectedMonth,
        setSelectedMonth,
        togglePaymentStatus,
        updatePaymentRecord,
        baseOpeningFund,
        updateBaseOpeningFund,
        totalCurrentBalance,
        liveFundSummary,
        eidEvents,
        updateEventFinances,
        addExpenseItem,
        updateExpenseItem,
        deleteExpenseItem,
        trustFundPool,
        aidRecords,
        aidApplications,
        addAidRecord,
        updateAidRecord,
        deleteAidRecord,
        submitAidApplication,
        updateTrustFundPool,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
