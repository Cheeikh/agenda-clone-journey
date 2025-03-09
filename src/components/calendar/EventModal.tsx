
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Clock, MapPin, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarEvent } from '@/lib/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<CalendarEvent>) => void;
  event?: Partial<CalendarEvent>;
  selectedDate?: Date;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  event,
  selectedDate
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState('blue');
  const [allDay, setAllDay] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setStartDate(event.start);
      setEndDate(event.end);
      setStartTime(event.start ? format(event.start, 'HH:mm') : '09:00');
      setEndTime(event.end ? format(event.end, 'HH:mm') : '10:00');
      setDescription(event.description || '');
      setLocation(event.location || '');
      setColor(event.color || 'blue');
      setAllDay(event.allDay || false);
    } else if (selectedDate) {
      setStartDate(selectedDate);
      setEndDate(selectedDate);
    }
  }, [event, selectedDate, isOpen]);

  const handleSave = () => {
    if (!startDate || !endDate) return;
    
    const [startHours, startMinutes] = allDay ? [0, 0] : startTime.split(':').map(Number);
    const [endHours, endMinutes] = allDay ? [23, 59] : endTime.split(':').map(Number);
    
    const start = new Date(startDate);
    start.setHours(startHours, startMinutes, 0);
    
    const end = new Date(endDate);
    end.setHours(endHours, endMinutes, 0);
    
    onSave({
      id: event?.id || String(Date.now()),
      title,
      start,
      end,
      description,
      location,
      color,
      allDay
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden animate-scale-in">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            {event?.id ? 'Modifier l\'événement' : 'Nouvel événement'}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ajouter un titre"
              className="text-lg border-0 border-b p-0 h-10 rounded-none focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center">
            <div className="flex items-center">
              <Switch
                checked={allDay}
                onCheckedChange={setAllDay}
                id="all-day"
              />
              <Label htmlFor="all-day" className="ml-2">Toute la journée</Label>
            </div>
            <div></div>
            
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    {startDate ? format(startDate, 'PPP', { locale: fr }) : (
                      <span>Date de début</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    {endDate ? format(endDate, 'PPP', { locale: fr }) : (
                      <span>Date de fin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {!allDay && (
              <>
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="grid grid-cols-2 gap-2">
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Heure de début" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, hour) => (
                        [0, 30].map(minute => {
                          const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                          return (
                            <SelectItem key={timeValue} value={timeValue}>
                              {timeValue}
                            </SelectItem>
                          );
                        })
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Heure de fin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, hour) => (
                        [0, 30].map(minute => {
                          const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                          return (
                            <SelectItem key={timeValue} value={timeValue}>
                              {timeValue}
                            </SelectItem>
                          );
                        })
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ajouter un lieu"
              className="h-9"
            />
            
            <div className="text-muted-foreground">Couleur</div>
            <div className="flex gap-2">
              {['blue', 'green', 'red', 'purple', 'yellow', 'orange', 'cyan'].map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={cn(
                    "w-6 h-6 rounded-full border-2",
                    `bg-${colorOption}-500`,
                    color === colorOption ? "border-gray-900 dark:border-white" : "border-transparent"
                  )}
                  onClick={() => setColor(colorOption)}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ajouter une description"
              className="min-h-[80px]"
            />
          </div>
        </div>
        
        <DialogFooter className="bg-secondary/50 px-6 py-4">
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
