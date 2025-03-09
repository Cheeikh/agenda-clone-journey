import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Clock, MapPin, X, Trash2, RotateCcw, Bell, Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarEvent } from '@/lib/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useCalendar } from '@/contexts/CalendarContext';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<CalendarEvent>) => void;
  onDelete?: (eventId: string) => void;
  event?: Partial<CalendarEvent>;
  selectedDate?: Date;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
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
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('none');
  const [notification, setNotification] = useState<'none' | '10min' | '30min' | '1hour' | '1day'>('30min');
  const [guests, setGuests] = useState<string[]>([]);
  const [guestsInput, setGuestsInput] = useState('');
  const [calendarType, setCalendarType] = useState<'personal' | 'work' | 'family'>('personal');
  const [activeTab, setActiveTab] = useState('details');

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
      
      // Type-safe handling of recurrence
      if (event.recurrence && ['none', 'daily', 'weekly', 'monthly', 'yearly', 'custom'].includes(event.recurrence)) {
        setRecurrence(event.recurrence as 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom');
      } else {
        setRecurrence('none');
      }
      
      // Type-safe handling of notification
      if (event.notification && ['none', '10min', '30min', '1hour', '1day'].includes(event.notification)) {
        setNotification(event.notification as 'none' | '10min' | '30min' | '1hour' | '1day');
      } else {
        setNotification('30min');
      }
      
      // Type-safe handling of guests
      if (Array.isArray(event.guests)) {
        setGuests(event.guests);
      } else {
        setGuests([]);
      }
      
      // Type-safe handling of calendarType
      if (event.calendarType && ['personal', 'work', 'family'].includes(event.calendarType)) {
        setCalendarType(event.calendarType as 'personal' | 'work' | 'family');
      } else {
        setCalendarType('personal');
      }
    } else if (selectedDate) {
      setStartDate(selectedDate);
      setEndDate(selectedDate);
      
      // If a specific time was selected, use it
      if (selectedDate.getHours() !== 0 || selectedDate.getMinutes() !== 0) {
        setStartTime(format(selectedDate, 'HH:mm'));
        
        // Set end time to 1 hour after start time
        const endDateTime = new Date(selectedDate);
        endDateTime.setHours(endDateTime.getHours() + 1);
        setEndTime(format(endDateTime, 'HH:mm'));
      }
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
      allDay,
      recurrence,
      notification,
      guests,
      calendarType
    });
    
    onClose();
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
    }
  };

  const handleAddGuest = () => {
    if (guestsInput.trim()) {
      setGuests([...guests, guestsInput.trim()]);
      setGuestsInput('');
    }
  };

  const handleRemoveGuest = (index: number) => {
    const newGuests = [...guests];
    newGuests.splice(index, 1);
    setGuests(newGuests);
  };

  const colorOptions = [
    { name: 'Bleu', value: 'blue' },
    { name: 'Vert', value: 'green' },
    { name: 'Rouge', value: 'red' },
    { name: 'Violet', value: 'purple' },
    { name: 'Jaune', value: 'yellow' },
    { name: 'Orange', value: 'orange' },
    { name: 'Cyan', value: 'cyan' }
  ];

  const recurrenceOptions = [
    { name: 'Aucune', value: 'none' },
    { name: 'Tous les jours', value: 'daily' },
    { name: 'Toutes les semaines', value: 'weekly' },
    { name: 'Tous les mois', value: 'monthly' },
    { name: 'Tous les ans', value: 'yearly' }
  ];

  const notificationOptions = [
    { name: 'Aucune', value: 'none' },
    { name: '10 minutes avant', value: '10min' },
    { name: '30 minutes avant', value: '30min' },
    { name: '1 heure avant', value: '1hour' },
    { name: '1 jour avant', value: '1day' }
  ];

  const calendarOptions = [
    { name: 'Personnel', value: 'personal' },
    { name: 'Travail', value: 'work' },
    { name: 'Famille', value: 'family' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden animate-scale-in">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            {event?.id ? 'Modifier l\'événement' : 'Nouvel événement'}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-2">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ajouter un titre"
              className="text-lg border-0 border-b p-0 h-10 rounded-none focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          
          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="schedule">Horaire</TabsTrigger>
                <TabsTrigger value="guests">Invités</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 py-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ajouter un lieu"
                    className="h-9"
                  />
                  
                  <div className="text-muted-foreground flex items-center">
                    <Bell className="h-5 w-5 mr-1" />
                  </div>
                  <Select value={notification} onValueChange={(value) => setNotification(value as 'none' | '10min' | '30min' | '1hour' | '1day')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Notification" />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="text-muted-foreground">
                    Calendrier
                  </div>
                  <Select value={calendarType} onValueChange={(value) => setCalendarType(value as 'personal' | 'work' | 'family')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un calendrier" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendarOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="text-muted-foreground">
                    Couleur
                  </div>
                  <Select value={color} onValueChange={setColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Couleur" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full bg-${option.value}-500 mr-2`}></div>
                            {option.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="text-muted-foreground">
                    Description
                  </div>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ajouter une description"
                    className="min-h-[80px]"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4 py-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground mr-1" />
                  </div>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          {startDate ? (
                            format(startDate, "PPP", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          {endDate ? (
                            format(endDate, "PPP", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-1" />
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="all-day"
                        checked={allDay}
                        onCheckedChange={setAllDay}
                      />
                      <Label htmlFor="all-day">Toute la journée</Label>
                    </div>
                    
                    {!allDay && (
                      <>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-24"
                        />
                        <span>-</span>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-24"
                        />
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <RotateCcw className="h-5 w-5 text-muted-foreground mr-1" />
                  </div>
                  <Select 
                    value={recurrence} 
                    onValueChange={(value) => setRecurrence(value as 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Récurrence" />
                    </SelectTrigger>
                    <SelectContent>
                      {recurrenceOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="guests" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      value={guestsInput}
                      onChange={(e) => setGuestsInput(e.target.value)}
                      placeholder="Ajouter des invités (email)"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddGuest();
                        }
                      }}
                    />
                    <Button onClick={handleAddGuest} type="button">
                      Ajouter
                    </Button>
                  </div>
                  
                  {guests.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <Label>Invités</Label>
                      <div className="border rounded-md p-2 space-y-2">
                        {guests.map((guest, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{guest}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveGuest(index)}
                              className="h-6 w-6"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <Separator />
        
        <DialogFooter className="px-6 py-4">
          {event?.id && onDelete && (
            <Button variant="outline" onClick={handleDelete} className="mr-auto">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="mr-2">
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
