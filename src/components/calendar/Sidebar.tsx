
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentDate: Date;
  onChange: (date: Date | undefined) => void;
}

export const CalendarSidebar: React.FC<SidebarProps> = ({
  currentDate,
  onChange
}) => {
  const [calendars, setCalendars] = useState([
    { id: '1', name: 'Personnel', color: 'bg-blue-500', checked: true },
    { id: '2', name: 'Travail', color: 'bg-green-500', checked: true },
    { id: '3', name: 'Famille', color: 'bg-purple-500', checked: true },
    { id: '4', name: 'Jours fériés', color: 'bg-red-500', checked: true },
  ]);

  const toggleCalendar = (id: string) => {
    setCalendars(calendars.map(cal => 
      cal.id === id ? { ...cal, checked: !cal.checked } : cal
    ));
  };

  return (
    <SidebarContainer className="w-64 border-r">
      <SidebarHeader className="p-4 flex flex-col items-center">
        <div className="text-lg font-semibold mb-3">Mini Calendrier</div>
        <Calendar 
          mode="single"
          selected={currentDate}
          onSelect={onChange}
          className="border rounded-md bg-white dark:bg-gray-950 p-3 pointer-events-auto"
        />
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full">
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Mes calendriers</h3>
            <Separator className="my-2" />
            
            <div className="space-y-2 mt-3">
              {calendars.map(calendar => (
                <div key={calendar.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`calendar-${calendar.id}`} 
                    checked={calendar.checked}
                    onCheckedChange={() => toggleCalendar(calendar.id)}
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
              <div className="flex items-center space-x-2">
                <Checkbox id="calendar-birthdays" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <Label htmlFor="calendar-birthdays" className="cursor-pointer">
                  Anniversaires
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="calendar-reminders" />
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <Label htmlFor="calendar-reminders" className="cursor-pointer">
                  Rappels
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="calendar-tasks" />
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <Label htmlFor="calendar-tasks" className="cursor-pointer">
                  Tâches
                </Label>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>
      
      <SidebarFooter className="p-4 text-xs text-muted-foreground">
        Calendrier • v1.0
      </SidebarFooter>
    </SidebarContainer>
  );
};
