import { formatWeight } from '../format';

describe('formatWeight', () => {
  it('formats weight in grams', () => {
    expect(formatWeight(250)).toBe('250g');
    expect(formatWeight(1000)).toBe('1kg');
    expect(formatWeight(1500)).toBe('1.5kg');
  });

  it('handles edge cases', () => {
    expect(formatWeight(0)).toBe('0g');
    expect(formatWeight(999)).toBe('999g');
    expect(formatWeight(2000)).toBe('2kg');
  });
});
