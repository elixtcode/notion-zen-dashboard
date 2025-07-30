
import React from 'react';
import FocusTimer from '@/components/FocusTimer';
import ActivityTracker from '@/components/ActivityTracker';
import WorldClock from '@/components/WorldClock';
import DailyQuote from '@/components/DailyQuote';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[600px] grid grid-cols-2 gap-4 h-[600px]">
        {/* Left Column (50% width) */}
        <div className="flex flex-col gap-4">
          {/* World Clock - Top Half */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1">
            <WorldClock />
          </div>
          {/* Focus Timer - Bottom Half */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1">
            <FocusTimer />
          </div>
        </div>

        {/* Right Column (50% width) */}
        <div className="flex flex-col gap-4">
          {/* Quote of the Day - Top 25% */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: '25%' }}>
            <DailyQuote />
          </div>
          {/* Activity Tracker - Bottom 75% */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1">
            <ActivityTracker />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
