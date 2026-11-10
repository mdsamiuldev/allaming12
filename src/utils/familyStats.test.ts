import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFamilyStats, filterFamilyMembers, canUserManageMember } from './familyStats';
import { FamilyMember } from '../types';

const mockMembers: FamilyMember[] = [
  {
    id: 'm1',
    name: 'আব্দুল কাদের মোল্লা',
    gender: 'male',
    ageCategory: 'adult',
    age: 68,
    relationship: 'পরিবার প্রধান ও দাদা',
    livesHere: true,
    residenceDetail: 'মূল মোল্লা বাড়ি',
    occupation: 'অবসরপ্রাপ্ত শিক্ষক',
  },
  {
    id: 'm2',
    name: 'জাহানারা বেগম',
    gender: 'female',
    ageCategory: 'adult',
    age: 62,
    relationship: 'দাদী',
    livesHere: true,
    residenceDetail: 'মূল মোল্লা বাড়ি',
    occupation: 'গৃহিণী',
  },
  {
    id: 'm3',
    name: 'এমডি সামিউল ইসলাম',
    gender: 'male',
    ageCategory: 'adult',
    age: 26,
    relationship: 'নাতি (বড় ছেলে)',
    livesHere: true,
    residenceDetail: 'মূল মোল্লা বাড়ি',
    occupation: 'সফটওয়্যার ইঞ্জিনিয়ার',
  },
  {
    id: 'm4',
    name: 'নুসরাত জাহান মোল্লা',
    gender: 'female',
    ageCategory: 'child',
    age: 12,
    relationship: 'নাতনি',
    livesHere: true,
    residenceDetail: 'মূল মোল্লা বাড়ি',
    occupation: 'শিক্ষার্থী',
  },
  {
    id: 'm5',
    name: 'রাকিবুল হাসান মোল্লা',
    gender: 'male',
    ageCategory: 'adult',
    age: 32,
    relationship: 'ছেলে',
    livesHere: false,
    residenceDetail: 'কানাডা প্রবাসী',
    occupation: 'প্রকৌশলী',
  },
];

test('calculateFamilyStats correctly tallies demographics', () => {
  const stats = calculateFamilyStats(mockMembers);
  assert.equal(stats.totalMembers, 5);
  assert.equal(stats.maleCount, 3);
  assert.equal(stats.femaleCount, 2);
  assert.equal(stats.childrenCount, 1);
  assert.equal(stats.adultCount, 4);
  assert.equal(stats.residentCount, 4);
  assert.equal(stats.nonResidentCount, 1);
});

test('filterFamilyMembers searches and filters by residence and gender', () => {
  const residentsOnly = filterFamilyMembers(mockMembers, '', 'resident');
  assert.equal(residentsOnly.length, 4);

  const nonResidents = filterFamilyMembers(mockMembers, '', 'non-resident');
  assert.equal(nonResidents.length, 1);
  assert.equal(nonResidents[0].name, 'রাকিবুল হাসান মোল্লা');

  const females = filterFamilyMembers(mockMembers, '', 'all', 'female');
  assert.equal(females.length, 2);

  const searched = filterFamilyMembers(mockMembers, 'সামিউল');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'm3');
});

test('canUserManageMember correctly grants access to creator and master admin only', () => {
  const memberWithCreator: FamilyMember = {
    ...mockMembers[0],
    createdByEmail: 'member1@gmail.com',
  };

  // Creator can manage
  assert.equal(canUserManageMember(memberWithCreator, 'member1@gmail.com'), true);
  // Other user cannot manage
  assert.equal(canUserManageMember(memberWithCreator, 'otheruser@gmail.com'), false);
  // Unauthenticated user cannot manage
  assert.equal(canUserManageMember(memberWithCreator, null), false);
  // Master Admin (samiul122344@gmail.com) can manage
  assert.equal(canUserManageMember(memberWithCreator, 'samiul122344@gmail.com'), true);
});

test('filterFamilyMembers with filterOwnership my-added filters by current user email', () => {
  const list: FamilyMember[] = [
    { ...mockMembers[0], id: 'a1', createdByEmail: 'user1@gmail.com' },
    { ...mockMembers[1], id: 'a2', createdByEmail: 'user2@gmail.com' },
    { ...mockMembers[2], id: 'a3', createdByEmail: 'user1@gmail.com' },
  ];

  const user1Members = filterFamilyMembers(list, '', 'all', 'all', 'all', 'my-added', 'user1@gmail.com');
  assert.equal(user1Members.length, 2);
  assert.equal(user1Members[0].id, 'a1');
  assert.equal(user1Members[1].id, 'a3');

  const user2Members = filterFamilyMembers(list, '', 'all', 'all', 'all', 'my-added', 'user2@gmail.com');
  assert.equal(user2Members.length, 1);
  assert.equal(user2Members[0].id, 'a2');
});

