
import React, { useState, useRef } from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/lib/calendar';

interface DraggableMonthViewProps {
  days: Date[];
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onCreateEvent: (start: Date, end: Date) => void;
}

export const DraggableMonthView: React.FC<DraggableMonthViewProps> = ({
  days,
  currentDate,
  events,
  onDateClick,
  onEventClick,
  onCreateEvent,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDragStart = (day: Date) => {
    setIsDragging(true);
    setDragStart(day);
    setDragEnd(day);
  };

  const handleDragOver = (day: Date) => {
    if (isDragging) {
      setDragEnd(day);
    }
  };

  const handleDragEnd = () => {
    if (isDragging && dragStart && dragEnd) {
      // Ensure start date is before end date
      const start = dragStart < dragEnd ? dragStart : dragEnd;
      const end = dragStart < dragEnd ? dragEnd : dragStart;
      
      // Create a new event
      onCreateEvent(start, end);
    }
    
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  const isDraggedOver = (day: Date) => {
    if (!isDragging || !dragStart || !dragEnd) return false;
    
    // Determine if this day is within the drag range
    const start = dragStart < dragEnd ? dragStart : dragEnd;
    const end = dragStart < dragEnd ? dragEnd : dragStart;
    
    return day >= start && day <= end;
  };

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
          const isDraggedDay = isDraggedOver(day);
          
          return (
            <div
              key={i}
              ref={el => dayRefs.current[i] = el}
              className={cn(
                "min-h-[100px] p-1 border-t border-r border-border relative transition-colors duration-200",
                !isCurrentMonthDay && "bg-muted/30 text-muted-foreground",
                isToday && "bg-calendar-today",
                isDraggedDay && "bg-primary/10"
              )}
              onClick={() => onDateClick(day)}
              onMouseDown={() => handleDragStart(day)}
              onMouseOver={() => handleDragOver(day)}
              onMouseUp={handleDragEnd}
            >
              <div className={cn(
                "flex justify-between items-center text-sm font-medium p-1",
                isToday && "text-primary"
              )}>
                <span>{format(day, 'd')}</span>
                <button 
                  className="opacity-0 group-hover:opacity-100 hover:bg-primary/10 p-1 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDateClick(day);
                  }}
                >
                  <Plus className="h-3 w-3" />
                </button>
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
                      onEventClick(event);
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
