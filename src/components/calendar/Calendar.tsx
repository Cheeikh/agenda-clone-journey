
import React, { useState, useEffect } from 'react';
import { addDays, format, isSameDay, isSameMonth, startOfMonth, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarEvent, CalendarView, getDaysInMonth, getWeekDays, isToday, isCurrentMonth, getEventsForDate, generateTimeSlots } from '@/lib/calendar';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { CalendarSidebar } from './Sidebar';
import { EventModal } from './EventModal';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Initialize with some mock events
  useEffect(() => {
    // Adjust mock events to current month
    const today = new Date();
    const eventsData = [
      {
        id: '1',
        title: 'Réunion d\'équipe',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
        description: 'Réunion hebdomadaire d\'équipe',
        color: 'blue',
      },
      {
        id: '2',
        title: 'Déjeuner avec client',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 30),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
        location: 'Restaurant Le Français',
        color: 'green',
      },
      {
        id: '3',
        title: 'Présentation projet',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 30),
        description: 'Présentation du nouveau projet aux stakeholders',
        color: 'purple',
      },
      {
        id: '4',
        title: 'Jour férié',
        start: new Date(today.getFullYear(), today.getMonth(), 15),
        end: new Date(today.getFullYear(), today.getMonth(), 15, 23, 59),
        allDay: true,
        color: 'red',
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
      // Update existing event
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, ...eventData } as CalendarEvent : e));
    } else {
      // Add new event
      setEvents([...events, eventData as CalendarEvent]);
    }
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const startDate = startOfMonth(currentDate);
    const dayNames = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
    
    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 px-4 py-2 text-xs font-medium text-muted-foreground">
          {dayNames.map((day) => (
            <div key={day} className="flex justify-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 h-full bg-white dark:bg-gray-950">
          {days.map((day, i) => {
            const isToday = isSameDay(day, new Date());
            const isCurrentMonthDay = isSameMonth(day, currentDate);
            const dayEvents = events.filter(event => isSameDay(event.start, day));
            
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[100px] p-1 border-t border-r border-border relative transition-colors duration-200",
                  !isCurrentMonthDay && "bg-muted/30 text-muted-foreground",
                  isToday && "bg-calendar-today"
                )}
                onClick={() => handleDateClick(day)}
              >
                <div className={cn(
                  "flex justify-end text-sm font-medium p-1",
                  isToday && "text-primary"
                )}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1 min-h-[80px]">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "bg-calendar-event text-white text-xs p-1 rounded truncate cursor-pointer hover:bg-calendar-event-hover transition-colors",
                        `bg-${event.color}-500 hover:bg-${event.color}-600`
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      {event.allDay ? (
                        <span className="font-medium">{event.title}</span>
                      ) : (
                        <>
                          <span className="font-medium">
                            {format(event.start, 'HH:mm')} • {event.title}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground mt-1 text-right">
                      +{dayEvents.length - 3} autre{dayEvents.length - 3 > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays(currentDate);
    const timeSlots = generateTimeSlots();
    
    return (
      <div className="flex-1 overflow-auto">
        <div className="calendar-grid">
          {/* Time slots column */}
          <div className="border-r border-calendar-grid-border">
            <div className="h-12 border-b border-calendar-grid-border" />
            {timeSlots.map((slot) => (
              <div key={slot} className="h-12 text-xs text-right pr-2 pt-0 text-muted-foreground">
                <span>{slot}</span>
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          {days.map((day, index) => (
            <div key={index} className="flex flex-col">
              <div className="h-12 border-b border-r border-calendar-grid-border flex flex-col items-center justify-center">
                <div className="text-xs font-medium text-muted-foreground">
                  {format(day, 'EEEE', { locale: fr })}
                </div>
                <div className={cn(
                  "text-sm font-bold",
                  isToday(day) && "text-primary"
                )}>
                  {format(day, 'd', { locale: fr })}
                </div>
              </div>
              
              <div className="relative flex-1">
                {/* Time slots */}
                {timeSlots.map((slot, i) => (
                  <div 
                    key={i}
                    className="h-12 border-r border-b border-calendar-grid-border"
                    onClick={() => {
                      const [hours, minutes] = slot.split(':').map(Number);
                      const newDate = new Date(day);
                      newDate.setHours(hours, minutes);
                      handleDateClick(newDate);
                    }}
                  />
                ))}
                
                {/* Events */}
                {getEventsForDate(events, day).map(event => {
                  const startHour = event.start.getHours();
                  const startMinute = event.start.getMinutes();
                  const endHour = event.end.getHours();
                  const endMinute = event.end.getMinutes();
                  
                  const top = (startHour + startMinute / 60) * 48;
                  const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 48;
                  
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "calendar-event absolute left-0 right-0 mx-1 overflow-hidden shadow-sm hover:shadow-md z-10",
                        `bg-${event.color}-500 hover:bg-${event.color}-600`
                      )}
                      style={{
                        top: `${top}px`,
                        height: `${Math.max(height, 16)}px`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <div className="p-1">
                        <div className="text-xs font-medium">
                          {!event.allDay && format(event.start, 'HH:mm')}
                        </div>
                        <div className="font-medium truncate">{event.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const timeSlots = generateTimeSlots();
    
    return (
      <div className="flex-1 overflow-auto">
        <div className="calendar-grid" style={{ gridTemplateColumns: '70px 1fr' }}>
          {/* Time slots column */}
          <div className="border-r border-calendar-grid-border">
            <div className="h-12 border-b border-calendar-grid-border" />
            {timeSlots.map((slot) => (
              <div key={slot} className="h-12 text-xs text-right pr-2 pt-0 text-muted-foreground">
                <span>{slot}</span>
              </div>
            ))}
          </div>
          
          {/* Day column */}
          <div className="flex flex-col">
            <div className="h-12 border-b border-r border-calendar-grid-border flex flex-col items-center justify-center">
              <div className="text-xs font-medium text-muted-foreground">
                {format(currentDate, 'EEEE', { locale: fr })}
              </div>
              <div className={cn(
                "text-sm font-bold",
                isToday(currentDate) && "text-primary"
              )}>
                {format(currentDate, 'd MMMM', { locale: fr })}
              </div>
            </div>
            
            <div className="relative flex-1">
              {/* Time slots */}
              {timeSlots.map((slot, i) => (
                <div 
                  key={i}
                  className="h-12 border-r border-b border-calendar-grid-border"
                  onClick={() => {
                    const [hours, minutes] = slot.split(':').map(Number);
                    const newDate = new Date(currentDate);
                    newDate.setHours(hours, minutes);
                    handleDateClick(newDate);
                  }}
                />
              ))}
              
              {/* Events */}
              {getEventsForDate(events, currentDate).map(event => {
                const startHour = event.start.getHours();
                const startMinute = event.start.getMinutes();
                const endHour = event.end.getHours();
                const endMinute = event.end.getMinutes();
                
                const top = (startHour + startMinute / 60) * 48;
                const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 48;
                
                return (
                  <div
                    key={event.id}
                    className={cn(
                      "calendar-event absolute left-0 right-0 mx-1 overflow-hidden shadow-sm hover:shadow-md z-10",
                      `bg-${event.color}-500 hover:bg-${event.color}-600`
                    )}
                    style={{
                      top: `${top}px`,
                      height: `${Math.max(height, 16)}px`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    <div className="p-1">
                      <div className="text-xs font-medium">
                        {!event.allDay && format(event.start, 'HH:mm')}
                      </div>
                      <div className="font-medium truncate">{event.title}</div>
                      {event.location && (
                        <div className="text-xs truncate text-white/90">
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const filteredEvents = events
      .filter(event => {
        const eventMonth = event.start.getMonth();
        const eventYear = event.start.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        return eventMonth === currentMonth && eventYear === currentYear;
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-4 border-b border-border font-medium text-lg">
            Événements pour {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </div>
          
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Aucun événement prévu pour ce mois.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredEvents.map(event => (
                <div 
                  key={event.id}
                  className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex gap-4">
                    <div className="flex-none w-24 text-right text-sm text-muted-foreground">
                      {format(event.start, 'd MMM', { locale: fr })}
                      <div>
                        {event.allDay ? 
                          'Toute la journée' : 
                          `${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}`
                        }
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          `bg-${event.color}-500`
                        )}></div>
                        <h3 className="font-medium">{event.title}</h3>
                      </div>
                      
                      {event.location && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          📍 {event.location}
                        </div>
                      )}
                      
                      {event.description && (
                        <div className="mt-2 text-sm">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCalendarView = () => {
    switch (view) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      case 'agenda':
        return renderAgendaView();
      default:
        return renderMonthView();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        currentDate={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={setView}
        onCreateEvent={() => {
          setSelectedEvent(undefined);
          setSelectedDate(new Date());
          setIsEventModalOpen(true);
        }}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <CalendarSidebar 
          currentDate={currentDate}
          onChange={(date) => date && setCurrentDate(date)}
        />
        
        {renderCalendarView()}
        
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSave={handleSaveEvent}
          event={selectedEvent}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
};
