import { EidEvent, MonthlyPaymentRecord, ChandaMember, AidRecord } from '../types';

export interface EidFinanceSummary {
  cashInHand: number;
  totalCollected: number;
  totalSpent: number;
  estimatedBudget: number;
  remainingNeeded: number;
  itemCount: number;
}

export function calculateEidFinance(event: EidEvent): EidFinanceSummary {
  const totalSpent = event.expenses.reduce((acc, item) => acc + (item.actualCost || 0), 0);
  const totalEstimated = event.expenses.reduce((acc, item) => acc + (item.estimatedCost || 0), 0);
  const budget = event.estimatedBudget || totalEstimated;

  // Remaining money needed to fulfill the estimated budget from the current cash in hand
  const remainingNeeded = Math.max(0, budget - (event.totalCollected || 0));

  return {
    cashInHand: event.cashInHand,
    totalCollected: event.totalCollected,
    totalSpent,
    estimatedBudget: budget,
    remainingNeeded,
    itemCount: event.expenses.length,
  };
}

export interface MonthlyChandaStats {
  month: string;
  totalMembers: number;
  paidCount: number;
  unpaidCount: number;
  totalCollected: number;
  totalDue: number;
  expectedTotal: number;
  paidMemberIds: number[];
  unpaidMemberIds: number[];
}

export function calculateMonthlyChanda(
  members: ChandaMember[],
  records: MonthlyPaymentRecord[],
  targetMonth: string
): MonthlyChandaStats {
  const expectedTotal = members.reduce((sum, m) => sum + m.monthlyAmount, 0);
  let totalCollected = 0;
  const paidMemberIds: number[] = [];
  const unpaidMemberIds: number[] = [];

  for (const member of members) {
    const rec = records.find((r) => r.memberId === member.id && r.month === targetMonth);
    if (rec && rec.isPaid) {
      paidMemberIds.push(member.id);
      totalCollected += rec.amount || member.monthlyAmount;
    } else {
      unpaidMemberIds.push(member.id);
    }
  }

  const paidCount = paidMemberIds.length;
  const unpaidCount = unpaidMemberIds.length;
  const totalDue = Math.max(0, expectedTotal - totalCollected);

  return {
    month: targetMonth,
    totalMembers: members.length,
    paidCount,
    unpaidCount,
    totalCollected,
    totalDue,
    expectedTotal,
    paidMemberIds,
    unpaidMemberIds,
  };
}

export interface TrustStats {
  totalFundPool: number;
  totalDisbursed: number;
  currentBalance: number;
  totalCasesHelped: number;
}

export interface LiveFundSummary {
  baseOpeningFund: number;
  totalChandaCollected: number;
  totalAidDisbursed: number;
  currentBalance: number;
}

export function calculateLiveFundBalance(
  baseOpeningFund: number,
  monthlyPayments: MonthlyPaymentRecord[],
  aidRecords: AidRecord[]
): LiveFundSummary {
  const totalChandaCollected = monthlyPayments
    .filter((p) => p.isPaid)
    .reduce((sum, p) => sum + (p.amount || 500), 0);

  const totalAidDisbursed = aidRecords
    .filter((a) => a.status === 'অনুমোদিত ও প্রদানকৃত')
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  const currentBalance = Math.max(0, baseOpeningFund + totalChandaCollected - totalAidDisbursed);

  return {
    baseOpeningFund,
    totalChandaCollected,
    totalAidDisbursed,
    currentBalance,
  };
}

export function calculateTrustStats(
  baseFundPool: number,
  aidRecords: AidRecord[]
): TrustStats {
  const totalDisbursed = aidRecords.reduce((sum, r) => sum + r.amount, 0);
  const currentBalance = Math.max(0, baseFundPool - totalDisbursed);

  return {
    totalFundPool: baseFundPool,
    totalDisbursed,
    currentBalance,
    totalCasesHelped: aidRecords.length,
  };
}

export function formatBDT(amount: number): string {
  return new Intl.NumberFormat('bn-BD').format(amount) + ' ৳';
}

export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (w) => bengaliDigits[+w]);
}
