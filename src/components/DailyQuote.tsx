import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const motivationalQuotes = [
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  // Add more...
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
    <div className="w-full max-w-md px-4 py-5 mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Quote className="h-4 w-4 text-blue-600 shrink-0" />
        <h2 className="text-sm font-semibold text-gray-800">Quote of the Day</h2>
      </div>

      <div className="text-center">
        <blockquote className="text-sm sm:text-base text-gray-700 italic leading-relaxed break-words whitespace-pre-wrap">
          “{quote}”
        </blockquote>

        <div className="mt-3 text-xs text-gray-500">
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
