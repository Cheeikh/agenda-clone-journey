import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useCalendar } from '@/contexts/CalendarContext';

interface SidebarProps {
  currentDate: Date;
  onChange: (date: Date | undefined) => void;
}

export const CalendarSidebar: React.FC<SidebarProps> = ({
  currentDate,
  onChange
}) => {
  const { 
    calendarFilters, 
    otherCalendarFilters, 
    toggleCalendarFilter 
  } = useCalendar();

  return (
    <div className="h-full w-full border-r bg-white dark:bg-gray-950 overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="p-2 flex flex-col items-center overflow-hidden">
          <div className="w-full max-w-full overflow-hidden">
            <Calendar 
              mode="single"
              selected={currentDate}
              onSelect={onChange}
              className="border rounded-md bg-white dark:bg-gray-950 p-1 pointer-events-auto max-w-full scale-[0.85] sm:scale-[0.9] md:scale-[0.95]"
              showOutsideDays={true}
              fixedWeeks
              classNames={{
                months: "flex flex-col space-y-3",
                month: "space-y-3",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input rounded-md",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]",
                row: "flex w-full mt-1",
                cell: "h-8 w-8 text-center text-sm p-0 relative",
                day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-30",
                day_hidden: "invisible",
              }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-4 pt-0">
              <h3 className="text-sm font-medium mb-2">Mes calendriers</h3>
              <Separator className="my-2" />
              
              <div className="space-y-2 mt-3">
                {calendarFilters.map(calendar => (
                  <div key={calendar.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`calendar-${calendar.id}`} 
                      checked={calendar.checked}
                      onCheckedChange={() => toggleCalendarFilter(calendar.id)}
                    />
                    <div className={cn("w-3 h-3 rounded-full", calendar.color)} />
                    <Label htmlFor={`calendar-${calendar.id}`} className="cursor-pointer">
                      {calendar.name}
                    </Label>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-medium mt-6 mb-2">Autres calendriers</h3>
              <Separator className="my-2" />
              
              <div className="space-y-2 mt-3">
                {otherCalendarFilters.map(calendar => (
                  <div key={calendar.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`calendar-${calendar.id}`} 
                      checked={calendar.checked}
                      onCheckedChange={() => toggleCalendarFilter(calendar.id, true)}
                    />
                    <div className={cn("w-3 h-3 rounded-full", calendar.color)} />
                    <Label htmlFor={`calendar-${calendar.id}`} className="cursor-pointer">
                      {calendar.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
        
        <div className="p-4 text-xs text-muted-foreground">
          Calendrier • v1.0
        </div>
      </div>
    </div>
  );
};
