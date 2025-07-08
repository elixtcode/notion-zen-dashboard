
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const TimezoneDisplay = () => {
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

  const formatDate = (date: Date, timezone: string) => {
    return date.toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const pstTime = formatTime(currentTime, 'America/Los_Angeles');
  const phTime = formatTime(currentTime, 'Asia/Manila');
  const pstDate = formatDate(currentTime, 'America/Los_Angeles');
  const phDate = formatDate(currentTime, 'Asia/Manila');

  // Calculate time difference
  const pstOffset = -8; // PST is UTC-8
  const phOffset = 8;   // Philippine Time is UTC+8
  const timeDifference = phOffset - pstOffset; // 16 hours

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-200 h-fit">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-800">World Clock</h2>
      </div>

      <div className="space-y-6">
        {/* PST Time */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Pacific Standard Time</div>
          <div className="text-2xl font-mono font-bold text-gray-800">{pstTime}</div>
          <div className="text-sm text-gray-600">{pstDate}</div>
          <div className="text-xs text-gray-500 mt-1">UTC-8</div>
        </div>

        {/* Time Difference Indicator */}
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
            <div className="text-sm text-gray-600">
              PH Time is <span className="font-semibold text-purple-600">+{timeDifference} hours</span> ahead
            </div>
          </div>
        </div>

        {/* Philippine Time */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Philippine Time</div>
          <div className="text-2xl font-mono font-bold text-gray-800">{phTime}</div>
          <div className="text-sm text-gray-600">{phDate}</div>
          <div className="text-xs text-gray-500 mt-1">UTC+8</div>
        </div>
      </div>
    </Card>
  );
};

export default TimezoneDisplay;
