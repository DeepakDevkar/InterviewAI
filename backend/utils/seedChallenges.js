import { CodingChallenge } from '../models/CodingChallenge.js';
import { logger } from './logger.js';

const initialChallenges = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'easy',
    topic: 'arrays',
    points: 100,
    skeletonCode: 'function twoSum(nums, target) {\n  // Write solution here\n  return [];\n}',
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' }
    ],
    status: 'published'
  },
  {
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory.',
    difficulty: 'easy',
    topic: 'strings',
    points: 100,
    skeletonCode: 'function reverseString(s) {\n  // Write solution here\n  return s;\n}',
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' }
    ],
    status: 'published'
  },
  {
    title: 'N-th Fibonacci Number',
    description: 'The Fibonacci numbers, commonly denoted `F(n)` form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given `n`, calculate `F(n)`.',
    difficulty: 'medium',
    topic: 'dp',
    points: 200,
    skeletonCode: 'function fib(n) {\n  // Write solution here\n  return 0;\n}',
    testCases: [
      { input: '2', expectedOutput: '1' },
      { input: '4', expectedOutput: '3' },
      { input: '9', expectedOutput: '34' }
    ],
    status: 'published'
  }
];

export const seedCodingChallenges = async () => {
  try {
    const count = await CodingChallenge.countDocuments();
    if (count === 0) {
      logger.info('No coding challenges found in database. Seeding initial challenges...');
      await CodingChallenge.insertMany(initialChallenges);
      logger.info(`Successfully seeded ${initialChallenges.length} coding challenges.`);
    } else {
      logger.info('Coding challenges already exist in database. Skipping seed.');
    }
  } catch (error) {
    logger.error('Failed to seed coding challenges:', error);
  }
};
