import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay, addMonths, subMonths, parseISO, getHours, getMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
  location?: string;
  allDay?: boolean;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  notification?: 'none' | '10min' | '30min' | '1hour' | '1day';
  guests?: string[];
  calendarType?: 'personal' | 'work' | 'family';
  calendarId?: string; // ID du calendrier auquel appartient l'événement
};

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export function getDaysInMonth(date: Date): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = [];
  
  // Get the start of the week for the first day of the month
  let day = startOfWeek(start, { locale: fr });
  
  // Continue until we've included the end of the month
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }
  
  return days;
}

export function getWeekDays(startDate: Date): Date[] {
  const start = startOfWeek(startDate, { locale: fr });
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }
  
  return days;
}

export function getMonthLabel(date: Date): string {
  return format(date, 'MMMM yyyy', { locale: fr });
}

export function getDayLabel(date: Date): string {
  return format(date, 'EEEE d', { locale: fr });
}

export function getTimeLabel(date: Date): string {
  return format(date, 'HH:mm', { locale: fr });
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isCurrentMonth(date: Date, currentMonth: Date): boolean {
  return isSameMonth(date, currentMonth);
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function formatEventTime(event: CalendarEvent): string {
  if (event.allDay) {
    return 'Toute la journée';
  }
  
  return `${getTimeLabel(event.start)} - ${getTimeLabel(event.end)}`;
}

export function calculateEventPosition(event: CalendarEvent, dayStart: Date): {
  top: string;
  height: string;
} {
  if (event.allDay) {
    return { top: '0', height: '24px' };
  }
  
  const startHour = getHours(event.start);
  const startMinute = getMinutes(event.start);
  const endHour = getHours(event.end);
  const endMinute = getMinutes(event.end);
  
  const startPercentage = (startHour * 60 + startMinute) / (24 * 60) * 100;
  const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  const heightPercentage = durationMinutes / (24 * 60) * 100;
  
  return {
    top: `${startPercentage}%`,
    height: `${heightPercentage}%`,
  };
}

export function generateTimeSlots(): string[] {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    slots.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

// Sample mock data for events
export function getMockEvents(): CalendarEvent[] {
  return [
    {
      id: '1',
      title: 'Réunion d\'équipe',
      start: parseISO('2023-08-01T10:00:00'),
      end: parseISO('2023-08-01T11:30:00'),
      description: 'Réunion hebdomadaire d\'équipe',
      color: 'blue',
    },
    {
      id: '2',
      title: 'Déjeuner avec client',
      start: parseISO('2023-08-02T12:30:00'),
      end: parseISO('2023-08-02T14:00:00'),
      location: 'Restaurant Le Français',
      color: 'green',
    },
    {
      id: '3',
      title: 'Présentation projet',
      start: parseISO('2023-08-03T15:00:00'),
      end: parseISO('2023-08-03T16:30:00'),
      description: 'Présentation du nouveau projet aux stakeholders',
      color: 'purple',
    },
    {
      id: '4',
      title: 'Jour férié',
      start: parseISO('2023-08-15T00:00:00'),
      end: parseISO('2023-08-15T23:59:59'),
      allDay: true,
      color: 'red',
    }
  ];
}

export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => isSameDay(event.start, date));
}
