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

export function filterFamilyMembers(
  members: FamilyMember[],
  query: string,
  filterLiving: 'all' | 'resident' | 'non-resident' = 'all',
  filterGender: 'all' | 'male' | 'female' = 'all',
  filterAge: 'all' | 'child' | 'adult' = 'all'
): FamilyMember[] {
  const q = query.trim().toLowerCase();

  return members.filter((m) => {
    if (filterLiving === 'resident' && !m.livesHere) return false;
    if (filterLiving === 'non-resident' && m.livesHere) return false;
    if (filterGender !== 'all' && m.gender !== filterGender) return false;
    if (filterAge !== 'all' && m.ageCategory !== filterAge) return false;

    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.relationship.toLowerCase().includes(q) ||
      m.residenceDetail.toLowerCase().includes(q) ||
      (m.occupation && m.occupation.toLowerCase().includes(q))
    );
  });
}
