/* eslint-disable @typescript-eslint/no-explicit-any */
import { toDateType } from './date';

describe('test toDateType function', () => {
  it('should return null if input is null', async () => {
    const date = null as unknown as Date;
    const result = toDateType(date as any);
    expect(result).toEqual(null);
  });

  it('should return a date object if input is a string', async () => {
    const date = '2021-01-01T00:00:00Z';
    const result = toDateType(date);
    expect(result).toBeInstanceOf(Date);
    expect(result).toEqual(new Date(date));
  });

  it('should return a date object if input is a date', async () => {
    const date = new Date();
    const result = toDateType(date);
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toEqual(date.toISOString());
    expect(result).not.toBe(date);
  });
});
