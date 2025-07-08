import React, { useState, useEffect } from 'react';
import { Globe, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Clock {
  id: string;
  city: string;
  timezone: string;
}

const GMT_TIMEZONES = [
  { city: 'Baker Island', timezone: 'Etc/GMT+12', label: 'GMT-12:00 – Baker Island' },
  { city: 'Honolulu', timezone: 'Pacific/Honolulu', label: 'GMT-10:00 – Honolulu' },
  { city: 'Anchorage', timezone: 'America/Anchorage', label: 'GMT-09:00 – Anchorage' },
  { city: 'Los Angeles', timezone: 'America/Los_Angeles', label: 'GMT-08:00 – Los Angeles' },
  { city: 'Denver', timezone: 'America/Denver', label: 'GMT-07:00 – Denver' },
  { city: 'Chicago', timezone: 'America/Chicago', label: 'GMT-06:00 – Chicago' },
  { city: 'New York', timezone: 'America/New_York', label: 'GMT-05:00 – New York' },
  { city: 'Santiago', timezone: 'America/Santiago', label: 'GMT-04:00 – Santiago' },
  { city: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', label: 'GMT-03:00 – Buenos Aires' },
  { city: 'Praia', timezone: 'Atlantic/Cape_Verde', label: 'GMT-01:00 – Cape Verde' },
  { city: 'London', timezone: 'Europe/London', label: 'GMT+00:00 – London' },
  { city: 'Berlin', timezone: 'Europe/Berlin', label: 'GMT+01:00 – Berlin' },
  { city: 'Cairo', timezone: 'Africa/Cairo', label: 'GMT+02:00 – Cairo' },
  { city: 'Moscow', timezone: 'Europe/Moscow', label: 'GMT+03:00 – Moscow' },
  { city: 'Dubai', timezone: 'Asia/Dubai', label: 'GMT+04:00 – Dubai' },
  { city: 'Karachi', timezone: 'Asia/Karachi', label: 'GMT+05:00 – Karachi' },
  { city: 'Dhaka', timezone: 'Asia/Dhaka', label: 'GMT+06:00 – Dhaka' },
  { city: 'Bangkok', timezone: 'Asia/Bangkok', label: 'GMT+07:00 – Bangkok' },
  { city: 'Manila', timezone: 'Asia/Manila', label: 'GMT+08:00 – Manila' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', label: 'GMT+09:00 – Tokyo' },
  { city: 'Sydney', timezone: 'Australia/Sydney', label: 'GMT+10:00 – Sydney' },
  { city: 'Noumea', timezone: 'Pacific/Noumea', label: 'GMT+11:00 – Noumea' },
  { city: 'Auckland', timezone: 'Pacific/Auckland', label: 'GMT+12:00 – Auckland' },
];

const WorldClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clocks, setClocks] = useState<Clock[]>([
    { id: '1', city: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { id: '2', city: 'Manila', timezone: 'Asia/Manila' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timezone: string) => {
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getCityInfo = (city: string) => {
    return GMT_TIMEZONES.find(c => c.city === city) || GMT_TIMEZONES[0];
  };

  const handleCityChange = (clockId: string, newCity: string) => {
    const cityInfo = getCityInfo(newCity);
    setClocks(prev => prev.map(clock => 
      clock.id === clockId 
        ? { ...clock, city: cityInfo.city, timezone: cityInfo.timezone }
        : clock
    ));
  };

  const addClock = () => {
    if (clocks.length < 3) {
      const newClock: Clock = {
        id: Date.now().toString(),
        city: 'London',
        timezone: 'Europe/London'
      };
      setClocks(prev => [...prev, newClock]);
    }
  };

  const removeClock = (clockId: string) => {
    if (clocks.length > 2) {
      setClocks(prev => prev.filter(clock => clock.id !== clockId));
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
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

      <div className="flex-1 flex flex-col justify-start space-y-3">
        {clocks.map((clock) => {
          const cityInfo = getCityInfo(clock.city);
          const time = formatTime(currentTime, clock.timezone);
          return (
            <div key={clock.id} className="relative">
              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <Select value={clock.city} onValueChange={(value) => handleCityChange(clock.id, value)}>
                    <SelectTrigger className="w-auto border-0 bg-transparent p-0 h-auto text-xs font-medium text-gray-700 hover:text-purple-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GMT_TIMEZONES.map((city) => (
                        <SelectItem key={city.city} value={city.city}>
                          {city.label}
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
                <div className="text-lg font-mono font-bold text-gray-800">{time}</div>
                <div className="text-xs text-gray-500">{cityInfo.label.split('–')[0].trim()}</div>
              </div>
            </div>
          );
        })}

        {clocks.length > 1 && (
          <div className="text-center">
            <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
              <span className="font-medium text-purple-600">Multiple time zones displayed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldClock;
