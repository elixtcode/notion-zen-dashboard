import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const motivationalQuotes = [
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
"Success is the sum of small efforts repeated day in and day out. – Robert Collier",
"Start where you are. Use what you have. Do what you can. – Arthur Ashe",
"Done is better than perfect. – Sheryl Sandberg",
"Action is the foundational key to all success. – Pablo Picasso",
"Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
"The future depends on what you do today. – Mahatma Gandhi",
"If you’re going through hell, keep going. – Winston Churchill",
"Great things are done by a series of small things brought together. – Van Gogh",
"What you do today can improve all your tomorrows. – Ralph Marston",
"Success usually comes to those who are too busy to be looking for it. – Thoreau",
"A year from now you may wish you had started today. – Karen Lamb",
"The way to get started is to quit talking and begin doing. – Walt Disney",
"Discipline is the bridge between goals and accomplishment. – Jim Rohn",
"You miss 100% of the shots you don’t take. – Wayne Gretzky",
"Dreams don’t work unless you do. – John C. Maxwell",
"Do one thing every day that scares you. – Eleanor Roosevelt",
"Believe you can and you’re halfway there. – Theodore Roosevelt",
"You don’t need to see the whole staircase, just take the first step. – Martin Luther King Jr.",
"Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
"Motivation is what gets you started. Habit is what keeps you going. – Jim Rohn",
"Don’t count the days, make the days count. – Muhammad Ali",
"Small deeds done are better than great deeds planned. – Peter Marshall",
"Opportunities don't happen. You create them. – Chris Grosser",
"You are never too old to set another goal or dream a new dream. – C.S. Lewis",
"I am not a product of my circumstances. I am a product of my decisions. – Stephen Covey",
"The secret of getting ahead is getting started. – Mark Twain",
"Focus on being productive instead of busy. – Tim Ferriss",
"Well done is better than well said. – Benjamin Franklin",
"Quality means doing it right when no one is looking. – Henry Ford",
"Make each day your masterpiece. – John Wooden",
"It always seems impossible until it’s done. – Nelson Mandela",
"If opportunity doesn’t knock, build a door. – Milton Berle",
"Amateurs sit and wait. The rest just get up and go to work. – Stephen King",
"Don’t limit your challenges. Challenge your limits. – Unknown",
"Energy and persistence conquer all things. – Benjamin Franklin",
"Either you run the day or the day runs you. – Jim Rohn",
"You can if you think you can. – Norman Vincent Peale",
"There is no substitute for hard work. – Thomas Edison",
"Strive not to be a success, but rather to be of value. – Albert Einstein",
"A goal without a plan is just a wish. – Antoine de Saint-Exupéry",
"Success is never accidental. – Jack Dorsey",
"Don’t be afraid to give up the good to go for the great. – John D. Rockefeller",
"You don't have to be great to start, but you have to start to be great. – Zig Ziglar",
"Keep going. Everything you need will come to you. – Unknown",
"Work hard in silence, let success be your noise. – Frank Ocean",
"Today’s accomplishments were yesterday’s impossibilities. – Robert Schuller",
"Learn as if you will live forever, live like you will die tomorrow. – Mahatma Gandhi",
"Stay away from those who belittle your ambitions. – Mark Twain",
"Never confuse motion with action. – Ernest Hemingway",
"You become what you believe. – Oprah Winfrey",
"Act as if what you do makes a difference. It does. – William James",
"Success is liking yourself, what you do, and how you do it. – Maya Angelou",
"Happiness is not something ready made. It comes from your own actions. – Dalai Lama",
"The best way out is always through. – Robert Frost",
"The harder you work, the luckier you get. – Gary Player",
"In the middle of difficulty lies opportunity. – Albert Einstein",
"Work gives you meaning and purpose. – Stephen Hawking",
"The pain you feel today will be the strength you feel tomorrow. – Unknown",
"Don’t quit. Suffer now and live the rest of your life as a champion. – Muhammad Ali"
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
