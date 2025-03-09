import React from 'react';
import { Header } from './Header';
import { CalendarSidebar } from './Sidebar';
import { EventModal } from './EventModal';
import { DraggableMonthView } from './DraggableMonthView';
import { generateTimeSlots, getEventsForDate, getWeekDays, getDaysInMonth } from '@/lib/calendar';
import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useCalendar } from '@/contexts/CalendarContext';
import { useSidebar } from '@/components/ui/sidebar';

export const Calendar: React.FC = () => {
  const { state: sidebarState } = useSidebar();
  const isSidebarOpen = sidebarState === 'expanded';
  
  const {
    currentDate,
    view,
    events,
    selectedEvent,
    selectedDate,
    isEventModalOpen,
    timeZone,
    handleDateClick,
    handleEventClick,
    handleSaveEvent,
    handleDeleteEvent,
    handleCreateDragEvent,
    handleTimeZoneChange,
    closeEventModal,
    openEventModal,
    handlePrevious,
    handleNext,
    handleToday,
    setView,
    setCurrentDate,
  } = useCalendar();

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    
    return (
      <DraggableMonthView 
        days={days}
        currentDate={currentDate}
        events={events}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        onCreateEvent={handleCreateDragEvent}
      />
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
                  isSameDay(day, new Date()) && "text-primary"
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
                isSameDay(currentDate, new Date()) && "text-primary"
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
        timeZone={timeZone}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={setView}
        onTimeZoneChange={handleTimeZoneChange}
        onCreateEvent={openEventModal}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-300 ease-in-out overflow-hidden", 
            isSidebarOpen ? "md:w-64 w-full" : "w-0"
          )}
          style={{ 
            minWidth: isSidebarOpen ? "16rem" : "0",
            position: isSidebarOpen ? "relative" : "absolute"
          }}
        >
          <CalendarSidebar 
            currentDate={currentDate}
            onChange={(date) => date && setCurrentDate(date)}
          />
        </div>
        
        <main className="flex-1 overflow-auto relative">
          {renderCalendarView()}
        </main>
        
        <EventModal
          isOpen={isEventModalOpen}
          onClose={closeEventModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          event={selectedEvent}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
};
