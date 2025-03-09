import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { CalendarEvent, CalendarView } from '@/lib/calendar';
import { toast } from '@/hooks/use-toast';

export interface CalendarFilter {
  id: string;
  name: string;
  color: string;
  checked: boolean;
}

interface CalendarContextType {
  currentDate: Date;
  view: CalendarView;
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | undefined;
  selectedDate: Date | undefined;
  isEventModalOpen: boolean;
  timeZone: string;
  isSidebarOpen: boolean;
  calendarFilters: CalendarFilter[];
  otherCalendarFilters: CalendarFilter[];
  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleToday: () => void;
  handleDateClick: (date: Date) => void;
  handleEventClick: (event: CalendarEvent) => void;
  handleSaveEvent: (eventData: Partial<CalendarEvent>) => void;
  handleDeleteEvent: (eventId: string) => void;
  handleCreateDragEvent: (start: Date, end: Date) => void;
  handleTimeZoneChange: (newTimeZone: string) => void;
  closeEventModal: () => void;
  openEventModal: () => void;
  toggleSidebar: () => void;
  toggleCalendarFilter: (id: string, isOtherCalendar?: boolean) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeZone, setTimeZone] = useState('Europe/Paris');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [calendarFilters, setCalendarFilters] = useState<CalendarFilter[]>([
    { id: '1', name: 'Personnel', color: 'bg-blue-500', checked: true },
    { id: '2', name: 'Travail', color: 'bg-green-500', checked: true },
    { id: '3', name: 'Famille', color: 'bg-purple-500', checked: true },
    { id: '4', name: 'Jours fériés', color: 'bg-red-500', checked: true },
  ]);
  const [otherCalendarFilters, setOtherCalendarFilters] = useState<CalendarFilter[]>([
    { id: '5', name: 'Anniversaires', color: 'bg-yellow-500', checked: false },
    { id: '6', name: 'Rappels', color: 'bg-orange-500', checked: false },
    { id: '7', name: 'Tâches', color: 'bg-cyan-500', checked: false },
  ]);

  useEffect(() => {
    const today = new Date();
    const eventsData = [
      {
        id: '1',
        title: 'Réunion d\'équipe',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
        description: 'Réunion hebdomadaire d\'équipe',
        color: 'blue',
        calendarId: '2', // Travail
      },
      {
        id: '2',
        title: 'Déjeuner avec client',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 30),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
        location: 'Restaurant Le Français',
        color: 'green',
        calendarId: '2', // Travail
      },
      {
        id: '3',
        title: 'Présentation projet',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 30),
        description: 'Présentation du nouveau projet aux stakeholders',
        color: 'purple',
        calendarId: '3', // Famille
      },
      {
        id: '4',
        title: 'Jour férié',
        start: new Date(today.getFullYear(), today.getMonth(), 15),
        end: new Date(today.getFullYear(), today.getMonth(), 15, 23, 59),
        allDay: true,
        color: 'red',
        calendarId: '4', // Jours fériés
      },
      {
        id: '5',
        title: 'Rendez-vous médical',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 9, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 10, 0),
        description: 'Consultation annuelle',
        color: 'blue',
        calendarId: '1', // Personnel
      },
      {
        id: '6',
        title: 'Anniversaire de Marie',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 23, 59),
        allDay: true,
        color: 'yellow',
        calendarId: '5', // Anniversaires
      }
    ];
    setEvents(eventsData as CalendarEvent[]);
  }, []);

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(undefined);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    if (selectedEvent) {
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, ...eventData } as CalendarEvent : e));
      toast({
        title: "Événement modifié",
        description: "L'événement a été mis à jour avec succès.",
      });
    } else {
      const newEvent = {
        id: String(Date.now()),
        ...eventData
      } as CalendarEvent;
      setEvents([...events, newEvent]);
      toast({
        title: "Événement créé",
        description: "L'événement a été créé avec succès.",
      });
    }
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    setIsEventModalOpen(false);
    toast({
      title: "Événement supprimé",
      description: "L'événement a été supprimé avec succès.",
    });
  };

  const handleCreateDragEvent = (start: Date, end: Date) => {
    setSelectedDate(start);
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  };

  const handleTimeZoneChange = (newTimeZone: string) => {
    setTimeZone(newTimeZone);
    toast({
      title: "Fuseau horaire modifié",
      description: `Le fuseau horaire a été changé pour ${newTimeZone}.`,
    });
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
  };

  const openEventModal = () => {
    setSelectedEvent(undefined);
    setSelectedDate(new Date());
    setIsEventModalOpen(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleCalendarFilter = (id: string, isOtherCalendar: boolean = false) => {
    if (isOtherCalendar) {
      setOtherCalendarFilters(otherCalendarFilters.map(cal => 
        cal.id === id ? { ...cal, checked: !cal.checked } : cal
      ));
    } else {
      setCalendarFilters(calendarFilters.map(cal => 
        cal.id === id ? { ...cal, checked: !cal.checked } : cal
      ));
    }
  };

  // Filtrer les événements en fonction des filtres de calendrier actifs
  const filteredEvents = events.filter(event => {
    // Si l'événement n'a pas de calendarId, on le montre toujours
    if (!event.calendarId) return true;
    
    // Vérifier dans les calendriers principaux
    const mainCalendarFilter = calendarFilters.find(cal => cal.id === event.calendarId);
    if (mainCalendarFilter) return mainCalendarFilter.checked;
    
    // Vérifier dans les autres calendriers
    const otherCalendarFilter = otherCalendarFilters.find(cal => cal.id === event.calendarId);
    if (otherCalendarFilter) return otherCalendarFilter.checked;
    
    // Par défaut, montrer l'événement
    return true;
  });

  const value = {
    currentDate,
    view,
    events: filteredEvents,
    selectedEvent,
    selectedDate,
    isEventModalOpen,
    timeZone,
    isSidebarOpen,
    calendarFilters,
    otherCalendarFilters,
    setCurrentDate,
    setView,
    handlePrevious,
    handleNext,
    handleToday,
    handleDateClick,
    handleEventClick,
    handleSaveEvent,
    handleDeleteEvent,
    handleCreateDragEvent,
    handleTimeZoneChange,
    closeEventModal,
    openEventModal,
    toggleSidebar,
    toggleCalendarFilter
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
