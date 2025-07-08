
import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const WorldClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const pstTime = formatTime(currentTime, 'America/Los_Angeles');
  const phTime = formatTime(currentTime, 'Asia/Manila');

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-4 w-4 text-purple-600" />
        <h2 className="text-sm font-semibold text-gray-800">World Clock</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4">
        {/* PST Time */}
        <div className="text-center p-3 bg-blue-50 rounded">
          <div className="text-xs text-gray-600 mb-1">Pacific Standard Time</div>
          <div className="text-lg font-mono font-bold text-gray-800">{pstTime}</div>
          <div className="text-xs text-gray-500">UTC-8</div>
        </div>

        {/* Time Difference */}
        <div className="text-center">
          <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
            PH Time is <span className="font-semibold text-purple-600">+16 hours</span> ahead
          </div>
        </div>

        {/* Philippine Time */}
        <div className="text-center p-3 bg-purple-50 rounded">
          <div className="text-xs text-gray-600 mb-1">Philippine Time</div>
          <div className="text-lg font-mono font-bold text-gray-800">{phTime}</div>
          <div className="text-xs text-gray-500">UTC+8</div>
        </div>
      </div>
    </div>
  );
};

export default WorldClock;
