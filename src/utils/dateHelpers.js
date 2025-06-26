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
return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    return '';
  }
};

// Calendar-specific helper functions
export const startOfMonth = (date) => {
  const start = new Date(date);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const endOfMonth = (date) => {
  const end = new Date(date);
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const startOfWeek = (date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day;
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    
    if (!isValid(d1) || !isValid(d2)) return false;
    
    return d1.toDateString() === d2.toDateString();
  } catch (error) {
    return false;
  }
};

export const isSameMonth = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    
    if (!isValid(d1) || !isValid(d2)) return false;
    
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
  } catch (error) {
    return false;
  }
};

export const formatMonthYear = (date) => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    
    return format(parsedDate, 'MMMM yyyy');
  } catch (error) {
    return '';
  }
};

export const formatDayOfMonth = (date) => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    
    return format(parsedDate, 'd');
  } catch (error) {
    return '';
  }
};

export const getCalendarDays = (date) => {
  const month = new Date(date);
  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);
  const startDay = startOfWeek(firstDay);
  
  const days = [];
  let currentDay = new Date(startDay);
  
  // Generate 6 weeks (42 days) to ensure full calendar grid
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDay));
    currentDay = addDays(currentDay, 1);
  }
  
  return days;
};

export const getTasksForDate = (tasks, date) => {
  if (!tasks || !date) return [];
  
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    return isSameDay(task.dueDate, date);
  });
};

export const getDateStatus = (date) => {
  const today = new Date();
  
  if (isSameDay(date, today)) return 'today';
  if (isPast(date) && !isSameDay(date, today)) return 'past';
  return 'future';
};