import { fizzbuzz } from './fizzbuzz';

const testData = [
  {
    testCase: '1の場合は1が返る',
    value: 1,
    expected: 1,
  },
  {
    testCase: '3の場合はFizzが返る',
    value: 3,
    expected: 'Fizz',
  },
  {
    testCase: '5の場合はBuzzが返る',
    value: 5,
    expected: 'Buzz',
  },
  {
    testCase: '15の場合はFizzBuzzが返る',
    value: 15,
    expected: 'FizzBuzz',
  },
];

describe('FizzBuzz', () => {
  testData.forEach((v) => {
    describe('FizzBuzz' + v.value, () => {
      test(v.testCase, () => {
        const result = fizzbuzz(v.value);
        expect(result).toBe(v.expected);
      });
    });
  });
});
