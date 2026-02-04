// Time utilities for calculations

// Calculate time difference in minutes
export const calculateTimeDifference = (startDate: Date, endDate: Date = new Date()): number => {
  return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));
};

// Add days to a date
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Add hours to a date
export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};