
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import PomodoroTimer from '@/components/PomodoroTimer';
import TimeLogger from '@/components/TimeLogger';
import TimezoneDisplay from '@/components/TimezoneDisplay';
import DailyQuote from '@/components/DailyQuote';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Productivity Dashboard</h1>
          <p className="text-gray-600 text-sm">Focus • Track • Motivate</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <PomodoroTimer />
          </div>

          {/* Time Logger */}
          <div>
            <TimeLogger />
          </div>

          {/* Timezone Display */}
          <div>
            <TimezoneDisplay />
          </div>

          {/* Daily Quote */}
          <div className="lg:col-span-2">
            <DailyQuote />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
