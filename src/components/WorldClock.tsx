import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Clock {
  id: string;
  city: string;
  timezone: string;
}

const WORLD_CITIES = [
  { city: 'Los Angeles', timezone: 'America/Los_Angeles', gmt: 'GMT-8' },
  { city: 'New York', timezone: 'America/New_York', gmt: 'GMT-5' },
  { city: 'London', timezone: 'Europe/London', gmt: 'GMT+0' },
  { city: 'Berlin', timezone: 'Europe/Berlin', gmt: 'GMT+1' },
  { city: 'Paris', timezone: 'Europe/Paris', gmt: 'GMT+1' },
  { city: 'Moscow', timezone: 'Europe/Moscow', gmt: 'GMT+3' },
  { city: 'Dubai', timezone: 'Asia/Dubai', gmt: 'GMT+4' },
  { city: 'Singapore', timezone: 'Asia/Singapore', gmt: 'GMT+8' },
  { city: 'Manila', timezone: 'Asia/Manila', gmt: 'GMT+8' },
  { city: 'Beijing', timezone: 'Asia/Shanghai', gmt: 'GMT+8' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', gmt: 'GMT+9' },
  { city: 'Sydney', timezone: 'Australia/Sydney', gmt: 'GMT+11' },
];

const WorldClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clocks, setClocks] = useState<Clock[]>([
    { id: '1', city: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { id: '2', city: 'Manila', timezone: 'Asia/Manila' },
    { id: '3', city: 'London', timezone: 'Europe/London' },
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
      hour12: true,
    });
  };

  const handleCityChange = (clockId: string, newCity: string) => {
    const cityInfo = WORLD_CITIES.find((c) => c.city === newCity);
    if (!cityInfo) return;
    setClocks((prev) =>
      prev.map((clock) =>
        clock.id === clockId
          ? { ...clock, city: cityInfo.city, timezone: cityInfo.timezone }
          : clock
      )
    );
  };

  const getCityInfo = (city: string) => {
    return WORLD_CITIES.find((c) => c.city === city) || WORLD_CITIES[0];
  };

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-4 w-4 text-purple-600" />
        <h2 className="text-sm font-semibold text-gray-800">World Clock</h2>
      </div>

      <div className="flex flex-col gap-1 h-full justify-start">
        {clocks.map((clock) => {
          const cityInfo = getCityInfo(clock.city);
          const time = formatTime(currentTime, clock.timezone);

          return (
            <div
              key={clock.id}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded border p-2 flex flex-col justify-center"
              style={{ minHeight: '68px' }}
            >
              <Select
                value={clock.city}
                onValueChange={(value) => handleCityChange(clock.id, value)}
              >
                <SelectTrigger className="w-full mb-1 border rounded text-xs font-medium text-gray-700">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {WORLD_CITIES.map((city) => (
                    <SelectItem key={city.city} value={city.city}>
                      {`${city.gmt} – ${city.city}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-center">
                <div className="text-sm font-mono font-bold text-gray-800">{time} <span className="text-xs text-gray-500">({cityInfo.gmt})</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorldClock;
