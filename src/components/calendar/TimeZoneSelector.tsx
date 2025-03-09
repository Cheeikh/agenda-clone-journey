
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimeZoneSelectorProps {
  selectedTimeZone: string;
  onTimeZoneChange: (timeZone: string) => void;
}

export const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({ 
  selectedTimeZone,
  onTimeZoneChange
}) => {
  // Common timezones (can be expanded)
  const timeZones = [
    { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
    { value: 'Europe/London', label: 'Londres (GMT+0)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
    { value: 'Asia/Singapore', label: 'Singapour (GMT+8)' },
    { value: 'Australia/Sydney', label: 'Sydney (GMT+10)' },
  ];

  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedTimeZone} onValueChange={onTimeZoneChange}>
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="Sélectionner fuseau horaire" />
        </SelectTrigger>
        <SelectContent>
          {timeZones.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
