import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Menu, Plus, Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { 
  CalendarView,
  getMonthLabel, 
  getDayLabel 
} from '@/lib/calendar';
import { TimeZoneSelector } from './TimeZoneSelector';

interface HeaderProps {
  currentDate: Date;
  view: CalendarView;
  timeZone: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
  onCreateEvent: () => void;
  onTimeZoneChange: (timeZone: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  view,
  timeZone,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onCreateEvent,
  onTimeZoneChange
}) => {
  return (
    <header className="h-auto min-h-16 border-b border-border flex flex-wrap items-center px-2 sm:px-4 py-2 gap-1 sm:gap-2 bg-white dark:bg-gray-950 z-10 shadow-sm">
      <SidebarTrigger className="mr-1 sm:mr-2">
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      
      <div className="flex-none">
        <Button 
          onClick={onCreateEvent}
          className="rounded-full flex gap-1 px-2 sm:px-3 h-9 transition-all hover:shadow-md"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Créer</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-1">
        <Button variant="ghost" size="sm" onClick={onPrevious} className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onNext} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onToday} className="font-medium text-xs sm:text-sm px-2 h-8">
          Aujourd'hui
        </Button>
      </div>
      
      <h1 className="text-base sm:text-xl font-semibold ml-1 sm:ml-2 truncate max-w-[120px] sm:max-w-none">
        {view === 'month' ? getMonthLabel(currentDate) : 
         view === 'day' ? getDayLabel(currentDate) : 
         getMonthLabel(currentDate)}
      </h1>
      
      <div className="ml-auto flex items-center gap-1 sm:gap-3 flex-wrap justify-end">
        <TimeZoneSelector 
          selectedTimeZone={timeZone} 
          onTimeZoneChange={onTimeZoneChange} 
        />
        
        <div className="relative hidden lg:block w-48 xl:w-64">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Rechercher" 
            className="pl-10 h-8 w-full focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="border rounded-md overflow-hidden flex text-xs sm:text-sm">
          <Button
            variant={view === 'month' ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-8 px-1 sm:px-3"
            onClick={() => onViewChange('month')}
          >
            <span className="hidden sm:inline">Mois</span>
            <span className="sm:hidden">M</span>
          </Button>
          <Button
            variant={view === 'week' ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-8 px-1 sm:px-3"
            onClick={() => onViewChange('week')}
          >
            <span className="hidden sm:inline">Semaine</span>
            <span className="sm:hidden">S</span>
          </Button>
          <Button
            variant={view === 'day' ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-8 px-1 sm:px-3"
            onClick={() => onViewChange('day')}
          >
            <span className="hidden sm:inline">Jour</span>
            <span className="sm:hidden">J</span>
          </Button>
          <Button
            variant={view === 'agenda' ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-8 px-1 sm:px-3"
            onClick={() => onViewChange('agenda')}
          >
            <span className="hidden sm:inline">Agenda</span>
            <span className="sm:hidden">A</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
