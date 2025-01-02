export const toDateType = (date: string | Date): Date => {
  if (!date) {
    return null;
  }
  // always return a new date object
  return new Date(date);
};
