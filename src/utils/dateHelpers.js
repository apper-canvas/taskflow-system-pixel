import { format, isToday, isPast, isValid, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    
    if (isToday(parsedDate)) {
      return 'Today';
    }
    
    return format(parsedDate, 'MMM d');
  } catch (error) {
    return '';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    
    return format(parsedDate, 'MMM d, yyyy h:mm a');
  } catch (error) {
    return '';
  }
};

export const isOverdue = (date) => {
  if (!date) return false;
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return false;
    
    return isPast(parsedDate) && !isToday(parsedDate);
  } catch (error) {
    return false;
  }
};

export const isDueToday = (date) => {
  if (!date) return false;
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return false;
    
    return isToday(parsedDate);
  } catch (error) {
    return false;
  }
};

export const parseDateFromText = (text) => {
  const today = new Date();
  const lowerText = text.toLowerCase();
  
  // Parse "today", "tomorrow", "yesterday"
  if (lowerText.includes('today')) {
    return today;
  }
  
  if (lowerText.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  // Parse "next week", "next month"
  if (lowerText.includes('next week')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  }
  
  if (lowerText.includes('next month')) {
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  }
  
  // Parse specific dates (mm/dd, mm-dd, etc.)
  const datePatterns = [
    /(\d{1,2})\/(\d{1,2})/,  // mm/dd
    /(\d{1,2})-(\d{1,2})/,   // mm-dd
    /(\d{1,2})\.(\d{1,2})/   // mm.dd
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const month = parseInt(match[1]) - 1; // JavaScript months are 0-indexed
      const day = parseInt(match[2]);
      const year = today.getFullYear();
      
      if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
        const date = new Date(year, month, day);
        // If the date is in the past, assume next year
        if (date < today) {
          date.setFullYear(year + 1);
        }
        return date;
      }
    }
  }
  
  return null;
};

export const formatDateForInput = (date) => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    return '';
  }
};