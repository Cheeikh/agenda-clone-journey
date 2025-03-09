
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

interface HeaderProps {
  currentDate: Date;
  view: CalendarView;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
  onCreateEvent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onCreateEvent
}) => {
  return (
    <header className="h-16 border-b border-border flex items-center px-4 gap-2 bg-white dark:bg-gray-950 z-10 shadow-sm">
      <SidebarTrigger className="mr-2">
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      
      <div className="flex-none">
        <Button 
          onClick={onCreateEvent}
          className="rounded-full flex gap-1 px-3 transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Créer</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2 ml-1">
        <Button variant="ghost" size="sm" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onToday} className="font-medium">
          Aujourd'hui
        </Button>
      </div>
      
      <h1 className="text-xl font-semibold ml-2">
        {view === 'month' ? getMonthLabel(currentDate) : 
         view === 'day' ? getDayLabel(currentDate) : 
         getMonthLabel(currentDate)}
      </h1>
      
      <div className="ml-auto flex gap-1">
        <div className="relative hidden md:block w-64">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Rechercher" 
            className="pl-10 h-9 w-full focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="border rounded-md overflow-hidden flex">
          <Button
            variant={view === 'month' ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-9 px-3"
            onClick={() => onViewChange('month')}
          >
            Mois
          </Button>
          <Button
            variant={view === 'week' ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-9 px-3"
            onClick={() => onViewChange('week')}
          >
            Semaine
          </Button>
          <Button
            variant={view === 'day' ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-9 px-3"
            onClick={() => onViewChange('day')}
          >
            Jour
          </Button>
          <Button
            variant={view === 'agenda' ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-9 px-3"
            onClick={() => onViewChange('agenda')}
          >
            Agenda
          </Button>
        </div>
      </div>
    </header>
  );
};
