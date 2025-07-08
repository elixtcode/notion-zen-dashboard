
import React from 'react';
import FocusTimer from '@/components/FocusTimer';
import ActivityTracker from '@/components/ActivityTracker';
import WorldClock from '@/components/WorldClock';
import DailyQuote from '@/components/DailyQuote';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[600px] grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-4 h-[600px]">
        {/* Focus Timer - Top Left */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <FocusTimer />
        </div>

        {/* Activity Tracker - Top Right */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <ActivityTracker />
        </div>

        {/* World Clock - Bottom Left */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <WorldClock />
        </div>

        {/* Daily Quote - Bottom Right */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DailyQuote />
        </div>
      </div>
    </div>
  );
};

export default Index;
