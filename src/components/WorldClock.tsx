import React, { useState, useEffect } from 'react';
import { Globe, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Clock {
  id: string;
  timezone: string;
}

const GMT_TIMEZONES = [
  { label: 'GMT-12:00 – Baker Island', value: 'Etc/GMT+12' },
  { label: 'GMT-11:00 – American Samoa', value: 'Etc/GMT+11' },
  { label: 'GMT-10:00 – Hawaii', value: 'Etc/GMT+10' },
  { label: 'GMT-09:00 – Alaska', value: 'Etc/GMT+9' },
  { label: 'GMT-08:00 – Los Angeles', value: 'Etc/GMT+8' },
  { label: 'GMT-07:00 – Denver', value: 'Etc/GMT+7' },
  { label: 'GMT-06:00 – Mexico City', value: 'Etc/GMT+6' },
  { label: 'GMT-05:00 – New York', value: 'Etc/GMT+5' },
  { label: 'GMT-04:00 – Santiago', value: 'Etc/GMT+4' },
  { label: 'GMT-03:00 – Buenos Aires', value: 'Etc/GMT+3' },
  { label: 'GMT-02:00 – South Georgia', value: 'Etc/GMT+2' },
  { label: 'GMT-01:00 – Azores', value: 'Etc/GMT+1' },
  { label: 'GMT+00:00 – London', value: 'Etc/GMT' },
  { label: 'GMT+01:00 – Berlin', value: 'Etc/GMT-1' },
  { label: 'GMT+02:00 – Cairo', value: 'Etc/GMT-2' },
  { label: 'GMT+03:00 – Moscow', value: 'Etc/GMT-3' },
  { label: 'GMT+04:00 – Dubai', value: 'Etc/GMT-4' },
  { label: 'GMT+05:00 – Karachi', value: 'Etc/GMT-5' },
  { label: 'GMT+06:00 – Dhaka', value: 'Etc/GMT-6' },
  { label: 'GMT+07:00 – Bangkok', value: 'Etc/GMT-7' },
  { label: 'GMT+08:00 – Manila', value: 'Etc/GMT-8' },
  { label: 'GMT+09:00 – Tokyo', value: 'Etc/GMT-9' },
  { label: 'GMT+10:00 – Sydney', value: 'Etc/GMT-10' },
  { label: 'GMT+11:00 – Solomon Islands', value: 'Etc/GMT-11' },
  { label: 'GMT+12:00 – Auckland', value: 'Etc/GMT-12' },
];

const WorldClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clocks, setClocks] = useState<Clock[]>([
    { id: '1', timezone: 'Etc/GMT-8' },
    { id: '2', timezone: 'Etc/GMT+8' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timezone: string) => {
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const addClock = () => {
    if (clocks.length < 3) {
      setClocks(prev => [
        ...prev,
        { id: Date.now().toString(), timezone: 'Etc/GMT' },
      ]);
    }
  };

  const removeClock = (id: string) => {
    if (clocks.length > 2) {
      setClocks(prev => prev.filter(clock => clock.id !== id));
    }
  };

  const handleTimezoneChange = (id: string, newTz: string) => {
    setClocks(prev =>
      prev.map(clock =>
        clock.id === id ? { ...clock, timezone: newTz } : clock
      )
    );
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-purple-600" />
          <h2 className="text-sm font-semibold text-gray-800">World Clock</h2>
        </div>
        {clocks.length < 3 && (
          <Button
            onClick={addClock}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2 justify-between">
        {clocks.map(clock => (
          <div
            key={clock.id}
            className="flex-1 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded border text-center"
          >
            <div className="flex justify-between items-center mb-1 text-xs text-gray-700">
              <Select
                value={clock.timezone}
                onValueChange={value => handleTimezoneChange(clock.id, value)}
              >
                <SelectTrigger className="border-0 bg-transparent p-0 h-auto text-xs font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GMT_TIMEZONES.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {clocks.length > 2 && (
                <Button
                  onClick={() => removeClock(clock.id)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="text-md font-mono font-bold text-gray-800">
              {formatTime(currentTime, clock.timezone)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldClock;
