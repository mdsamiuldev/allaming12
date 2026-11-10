import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFamilyStats, filterFamilyMembers } from './familyStats';
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
