/**
 * Date utility functions
 * Provides common date manipulation and formatting functions
 */

/**
 * Format date to string
 * @param date - Date object or string
 * @param format - Format string (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | null, format: string = 'YYYY-MM-DD'): string => {
  if (!date) {
    return '';
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const dayOfWeek = d.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('dddd', dayNames[dayOfWeek])
    .replace('ddd', dayNames[dayOfWeek].substring(0, 3))
    .replace('MMMM', monthNames[d.getMonth()])
    .replace('MMM', monthNames[d.getMonth()].substring(0, 3));
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param date - Date object or string
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date | string | null): string => {
  if (!date) {
    return '';
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return '';
  }

  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } else if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
};

/**
 * Check if date is today
 * @param date - Date object or string
 * @returns True if date is today
 */
export const isToday = (date: Date | string | null): boolean => {
  if (!date) {
    return false;
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return false;
  }

  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is yesterday
 * @param date - Date object or string
 * @returns True if date is yesterday
 */
export const isYesterday = (date: Date | string | null): boolean => {
  if (!date) {
    return false;
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return false;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Check if date is in the past
 * @param date - Date object or string
 * @returns True if date is in the past
 */
export const isPast = (date: Date | string | null): boolean => {
  if (!date) {
    return false;
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return false;
  }

  return d < new Date();
};

/**
 * Check if date is in the future
 * @param date - Date object or string
 * @returns True if date is in the future
 */
export const isFuture = (date: Date | string | null): boolean => {
  if (!date) {
    return false;
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return false;
  }

  return d > new Date();
};

/**
 * Add days to date
 * @param date - Date object or string
 * @param days - Number of days to add
 * @returns New date object
 */
export const addDays = (date: Date | string, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Add months to date
 * @param date - Date object or string
 * @param months - Number of months to add
 * @returns New date object
 */
export const addMonths = (date: Date | string, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

/**
 * Add years to date
 * @param date - Date object or string
 * @param years - Number of years to add
 * @returns New date object
 */
export const addYears = (date: Date | string, years: number): Date => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

/**
 * Get start of day
 * @param date - Date object or string
 * @returns Start of day
 */
export const startOfDay = (date: Date | string): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 * @param date - Date object or string
 * @returns End of day
 */
export const endOfDay = (date: Date | string): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in days
 */
export const diffInDays = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/**
 * Get difference in hours between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in hours
 */
export const diffInHours = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diff / (1000 * 60 * 60));
};

/**
 * Get difference in minutes between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in minutes
 */
export const diffInMinutes = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diff / (1000 * 60));
};

/**
 * Check if date is within date range
 * @param date - Date to check
 * @param startDate - Start date
 * @param endDate - End date
 * @returns True if date is within range
 */
export const isInRange = (
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): boolean => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return d >= start && d <= end;
};

/**
 * Get ISO date string
 * @param date - Date object or string
 * @returns ISO date string
 */
export const toISOString = (date: Date | string | null): string => {
  if (!date) {
    return '';
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return '';
  }

  return d.toISOString();
};

/**
 * Parse date from string
 * @param dateString - Date string
 * @returns Date object or null if invalid
 */
export const parseDate = (dateString: string | null): Date | null => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
};

/**
 * Get age from birthdate
 * @param birthdate - Birthdate
 * @returns Age in years
 */
export const getAge = (birthdate: Date | string | null): number => {
  if (!birthdate) {
    return 0;
  }

  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Get date range for filter
 * @param period - Period (today, week, month, year, all)
 * @returns Date range with start and end dates
 */
export const getDateRange = (
  period: 'today' | 'week' | 'month' | 'year' | 'all' = 'all'
): { startDate: Date | null; endDate: Date | null } => {
  const today = new Date();
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  switch (period.toLowerCase()) {
    case 'today':
      startDate = startOfDay(today);
      endDate = endOfDay(today);
      break;
    case 'week':
      startDate = startOfDay(addDays(today, -7));
      endDate = endOfDay(today);
      break;
    case 'month':
      startDate = startOfDay(addMonths(today, -1));
      endDate = endOfDay(today);
      break;
    case 'year':
      startDate = startOfDay(addYears(today, -1));
      endDate = endOfDay(today);
      break;
    case 'all':
    default:
      startDate = null;
      endDate = null;
      break;
  }

  return { startDate, endDate };
};

/**
 * Format date for display
 * @param date - Date object or string
 * @returns Formatted date string
 */
export const formatDateForDisplay = (date: Date | string | null): string => {
  if (!date) {
    return '';
  }

  if (isToday(date)) {
    return `Today at ${formatDate(date, 'HH:mm')}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${formatDate(date, 'HH:mm')}`;
  }

  return formatDate(date, 'MMM DD, YYYY');
};

/**
 * Format time for display
 * @param date - Date object or string
 * @returns Formatted time string
 */
export const formatTimeForDisplay = (date: Date | string | null): string => {
  if (!date) {
    return '';
  }

  return formatDate(date, 'HH:mm');
};

/**
 * Format date and time for display
 * @param date - Date object or string
 * @returns Formatted date and time string
 */
export const formatDateTimeForDisplay = (date: Date | string | null): string => {
  if (!date) {
    return '';
  }

  return formatDate(date, 'MMM DD, YYYY HH:mm');
};

/**
 * Get week start date
 * @param date - Date object or string
 * @returns Week start date
 */
export const getWeekStart = (date: Date | string = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday as start
  return startOfDay(new Date(d.setDate(diff)));
};

/**
 * Get week end date
 * @param date - Date object or string
 * @returns Week end date
 */
export const getWeekEnd = (date: Date | string = new Date()): Date => {
  const weekStart = getWeekStart(date);
  return endOfDay(addDays(weekStart, 6));
};

/**
 * Get month start date
 * @param date - Date object or string
 * @returns Month start date
 */
export const getMonthStart = (date: Date | string = new Date()): Date => {
  const d = new Date(date);
  return startOfDay(new Date(d.getFullYear(), d.getMonth(), 1));
};

/**
 * Get month end date
 * @param date - Date object or string
 * @returns Month end date
 */
export const getMonthEnd = (date: Date | string = new Date()): Date => {
  const d = new Date(date);
  return endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));
};

/**
 * Get year start date
 * @param date - Date object or string
 * @returns Year start date
 */
export const getYearStart = (date: Date | string = new Date()): Date => {
  const d = new Date(date);
  return startOfDay(new Date(d.getFullYear(), 0, 1));
};

/**
 * Get year end date
 * @param date - Date object or string
 * @returns Year end date
 */
export const getYearEnd = (date: Date | string = new Date()): Date => {
  const d = new Date(date);
  return endOfDay(new Date(d.getFullYear(), 11, 31));
};

/**
 * Check if date is weekend
 * @param date - Date object or string
 * @returns True if date is weekend
 */
export const isWeekend = (date: Date | string): boolean => {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6;
};

/**
 * Check if date is weekday
 * @param date - Date object or string
 * @returns True if date is weekday
 */
export const isWeekday = (date: Date | string): boolean => {
  return !isWeekend(date);
};

/**
 * Get business days between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of business days
 */
export const getBusinessDays = (startDate: Date | string, endDate: Date | string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let businessDays = 0;

  while (start <= end) {
    if (isWeekday(start)) {
      businessDays++;
    }
    start.setDate(start.getDate() + 1);
  }

  return businessDays;
};

