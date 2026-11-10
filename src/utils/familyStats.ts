import { FamilyMember } from '../types';

export interface FamilyDemographicStats {
  totalMembers: number;
  maleCount: number;
  femaleCount: number;
  childrenCount: number;
  adultCount: number;
  residentCount: number;
  nonResidentCount: number;
}

export function calculateFamilyStats(members: FamilyMember[]): FamilyDemographicStats {
  const totalMembers = members.length;
  let maleCount = 0;
  let femaleCount = 0;
  let childrenCount = 0;
  let adultCount = 0;
  let residentCount = 0;

  for (const m of members) {
    if (m.gender === 'male') {
      maleCount++;
    } else if (m.gender === 'female') {
      femaleCount++;
    }

    if (m.ageCategory === 'child' || (m.age !== undefined && m.age < 18)) {
      childrenCount++;
    } else {
      adultCount++;
    }

    if (m.livesHere) {
      residentCount++;
    }
  }

  return {
    totalMembers,
    maleCount,
    femaleCount,
    childrenCount,
    adultCount,
    residentCount,
    nonResidentCount: totalMembers - residentCount,
  };
}

export function canUserManageMember(
  member: FamilyMember,
  userEmail?: string | null,
  masterAdminEmail: string = 'samiul122344@gmail.com'
): boolean {
  if (!userEmail) return false;
  const cleanUser = userEmail.trim().toLowerCase();
  if (cleanUser === masterAdminEmail.toLowerCase()) return true;
  if (!member.createdByEmail) return false;
  return member.createdByEmail.trim().toLowerCase() === cleanUser;
}

export function filterFamilyMembers(
  members: FamilyMember[],
  query: string,
  filterLiving: 'all' | 'resident' | 'non-resident' = 'all',
  filterGender: 'all' | 'male' | 'female' = 'all',
  filterAge: 'all' | 'child' | 'adult' = 'all',
  filterOwnership: 'all' | 'my-added' = 'all',
  currentUserEmail?: string | null
): FamilyMember[] {
  const q = query.trim().toLowerCase();
  const cleanEmail = currentUserEmail?.trim().toLowerCase();

  return members.filter((m) => {
    if (filterLiving === 'resident' && !m.livesHere) return false;
    if (filterLiving === 'non-resident' && m.livesHere) return false;
    if (filterGender !== 'all' && m.gender !== filterGender) return false;
    if (filterAge !== 'all' && m.ageCategory !== filterAge) return false;

    if (filterOwnership === 'my-added') {
      if (!cleanEmail) return false;
      if (m.createdByEmail?.trim().toLowerCase() !== cleanEmail) return false;
    }

    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.relationship.toLowerCase().includes(q) ||
      m.residenceDetail.toLowerCase().includes(q) ||
      (m.occupation && m.occupation.toLowerCase().includes(q)) ||
      (m.createdByName && m.createdByName.toLowerCase().includes(q)) ||
      (m.createdByEmail && m.createdByEmail.toLowerCase().includes(q))
    );
  });
}
