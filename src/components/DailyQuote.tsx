import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const motivationalQuotes = [
  // [Quotes omitted for brevity...]
];

const DailyQuote = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const quoteOfTheDay = motivationalQuotes[dayOfYear % motivationalQuotes.length];
    setQuote(quoteOfTheDay);
  }, []);

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
        <h2 className="text-sm sm:text-base font-semibold text-gray-800">Quote of the Day</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center text-center">
        <blockquote className="text-xs sm:text-sm text-gray-700 italic leading-relaxed px-2 sm:px-4">
          "{quote}"
        </blockquote>

        <div className="mt-3 text-xs sm:text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyQuote;
