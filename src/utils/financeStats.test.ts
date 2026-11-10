import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEidFinance,
  calculateMonthlyChanda,
  calculateTrustStats,
  toBengaliNumber,
} from './financeStats';
import { EidEvent, ChandaMember, MonthlyPaymentRecord, AidRecord } from '../types';

test('calculateEidFinance correctly sums expenses and remaining needed', () => {
  const event: EidEvent = {
    id: 'eid-ul-fitr',
    title: 'ঈদুল ফিতর ২০২৬',
    subTitle: 'পারিবারিক মিলনমেলা ও ভোজ',
    year: 2026,
    date: '২০২৬-০৩-২১',
    cashInHand: 15000,
    totalCollected: 35000,
    estimatedBudget: 45000,
    status: 'upcoming',
    expenses: [
      { id: '1', name: 'বিরিয়ানি চাল ও মাংস', category: 'খাবার', estimatedCost: 20000, actualCost: 18500, isCompleted: true },
      { id: '2', name: 'সাউন্ড ও প্যান্ডেল', category: 'ডেকোরেশন', estimatedCost: 8000, actualCost: 7500, isCompleted: true },
      { id: '3', name: 'মিষ্টি ও ফল', category: 'খাবার', estimatedCost: 5000, actualCost: 4000, isCompleted: false },
    ],
  };

  const res = calculateEidFinance(event);
  assert.equal(res.totalSpent, 30000);
  assert.equal(res.cashInHand, 15000);
  assert.equal(res.totalCollected, 35000);
  assert.equal(res.estimatedBudget, 45000);
  assert.equal(res.remainingNeeded, 10000); // 45000 - 35000
});

test('calculateMonthlyChanda handles 15 members subscription math', () => {
  const members: ChandaMember[] = [
    { id: 1, name: 'সদস্য ১', fatherOrHusbandName: 'মোল্লা', phone: '01700', monthlyAmount: 500, avatar: '' },
    { id: 2, name: 'সদস্য ২', fatherOrHusbandName: 'মোল্লা', phone: '01700', monthlyAmount: 500, avatar: '' },
    { id: 3, name: 'সদস্য ৩', fatherOrHusbandName: 'মোল্লা', phone: '01700', monthlyAmount: 500, avatar: '' },
  ];

  const records: MonthlyPaymentRecord[] = [
    { memberId: 1, month: '2026-01', isPaid: true, amount: 500 },
    { memberId: 2, month: '2026-01', isPaid: false, amount: 500 },
  ];

  const stats = calculateMonthlyChanda(members, records, '2026-01');
  assert.equal(stats.expectedTotal, 1500);
  assert.equal(stats.paidCount, 1);
  assert.equal(stats.unpaidCount, 2);
  assert.equal(stats.totalCollected, 500);
  assert.equal(stats.totalDue, 1000);
});

test('calculateTrustStats calculates reserve balance and aid cases', () => {
  const aidRecords: AidRecord[] = [
    {
      id: 'a1',
      recipientName: 'করিম মোল্লা',
      relationship: 'চাচা',
      reason: 'অসুস্থতা ও চিকিৎসা',
      description: 'হাসপাতালে চিকিৎসা সহায়তা',
      amount: 15000,
      date: '২০২৬-০১-১২',
      approvedBy: 'অ্যাডমিন',
      status: 'অনুমোদিত ও প্রদানকৃত',
    },
    {
      id: 'a2',
      recipientName: 'রাবেয়া খাতুন',
      relationship: 'ফুফু',
      reason: 'জরুরি অপারেশন',
      description: 'চোখের ছানি অপারেশন',
      amount: 10000,
      date: '২০২৬-০২-০৫',
      approvedBy: 'অ্যাডমিন',
      status: 'অনুমোদিত ও প্রদানকৃত',
    },
  ];

  const trust = calculateTrustStats(80000, aidRecords);
  assert.equal(trust.totalFundPool, 80000);
  assert.equal(trust.totalDisbursed, 25000);
  assert.equal(trust.currentBalance, 55000);
  assert.equal(trust.totalCasesHelped, 2);
});

test('toBengaliNumber converts English digits to Bengali numerals', () => {
  assert.equal(toBengaliNumber(500), '৫০০');
  assert.equal(toBengaliNumber(2026), '২০২৬');
});
