import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const motivationalQuotes = [
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "Action is the foundational key to all success. – Pablo Picasso",
  "Success usually comes to those who are too busy to be looking for it. – Henry David Thoreau",
  "Everything you've ever wanted is on the other side of fear. – George Addair",
  "Opportunities don't happen. You create them. – Chris Grosser",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty. - Winston Churchill",
  "Don't let yesterday take up too much of today. - Will Rogers",
  "You learn more from failure than from success. Don't let it stop you. Failure builds character. - Unknown",
  "It's not whether you get knocked down, it's whether you get up. - Vince Lombardi",
  "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you. - Steve Jobs",
  "People who are crazy enough to think they can change the world, are the ones who do. - Rob Siltanen",
  "Failure will never overtake me if my determination to succeed is strong enough. - Og Mandino",
  "Entrepreneurs are great at dealing with uncertainty and also very good at minimizing risk. That's the classic entrepreneur. - Mohnish Pabrai",
  "We don't make mistakes, just happy little accidents. - Bob Ross",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "The only impossible journey is the one you never begin. - Tony Robbins",
  "In this life we cannot do great things. We can only do small things with great love. - Mother Teresa",
  "Only a life lived for others is a life worthwhile. - Albert Einstein",
  "The purpose of our lives is to be happy. - Dalai Lama",
  "Life is what happens to you while you're busy making other plans. - John Lennon",
  "You will face many defeats in life, but never let yourself be defeated. - Maya Angelou",
  "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
  "Many of life's failures are people who did not realize how close they were to success when they gave up. - Thomas Edison",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
  "If life were predictable it would cease to be life, and be without flavor. - Eleanor Roosevelt",
  "If you look at what you have in life, you'll always have more. - Oprah Winfrey",
  "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success. - James Cameron",
  "Life is a succession of lessons which must be lived to be understood. - Helen Keller",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "That's one small step for man, one giant leap for mankind. - Neil Armstrong",
  "Stay hungry, stay foolish. - Steve Jobs",
  "The good thing about science is that it's true whether or not you believe in it. - Neil deGrasse Tyson",
  "Be yourself; everyone else is already taken. - Oscar Wilde",
  "I have not failed. I've just found 10,000 ways that won't work. - Thomas A. Edison",
  "A woman is like a tea bag; you never know how strong it is until it's in hot water. - Eleanor Roosevelt",
  "A man who stands for nothing will fall for anything. - Malcolm X",
  "All our dreams can come true, if we have the courage to pursue them. - Walt Disney",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Life is 10% what happens to you and 90% how you react to it. - Charles R. Swindoll",
  "The most difficult thing is the decision to act, the rest is merely tenacity. - Amelia Earhart",
  "Every strike brings me closer to the next home run. - Babe Ruth",
  "Definiteness of purpose is the starting point of all achievement. - W. Clement Stone",
  "Life isn't about getting and having, it's about giving and being. - Kevin Kruse",
  "We become what we think about. - Earl Nightingale",
  "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. - Mark Twain",
  "The most common way people give up their power is by thinking they don't have any. - Alice Walker",
  "The mind is everything. What you think you become. - Buddha",
  "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
  "An unexamined life is not worth living. - Socrates",
  "Eighty percent of success is showing up. - Woody Allen",
  "Your most unhappy customers are your greatest source of learning. - Bill Gates",
  "A customer is the most important visitor on our premises. - Mahatma Gandhi",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Everything you've ever wanted is on the other side of fear. - George Addair",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The harder I work, the luckier I get. - Samuel Goldwyn",
  "Don't be afraid to give up the good to go for the great. - John D. Rockefeller",
  "The way to get things done is not to mind who gets the credit for doing them. - Benjamin Jowett",
  "Don't go through life, grow through life. - Eric Butterworth",
  "The most effective way to do it, is to do it. - Amelia Earhart",
  "The question isn't who is going to let me; it's who is going to stop me. - Ayn Rand",
  "People often say that motivation doesn't last. Well, neither does bathing. That's why we recommend it daily. - Zig Ziglar",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. - Aristotle",
  "If you hear a voice within you say 'you cannot paint,' then by all means paint and that voice will be silenced. - Vincent Van Gogh",
  "There is only one way to avoid criticism: do nothing, say nothing, and be nothing. - Aristotle",
  "Ask and it will be given to you; search, and you will find; knock and the door will be opened for you. - Jesus",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "Go confidently in the direction of your dreams. Live the life you have imagined. - Henry David Thoreau",
  "When I stand before God at the end of my life, I would hope that I would not have a single bit of talent left and could say, I used everything you gave me. - Erma Bombeck",
  "Few things can help an individual more than to place responsibility on him, and to let him know that you trust him. - Booker T. Washington",
  "Certain things catch your eye, but pursue only those that capture the heart. - Ancient Indian Proverb",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Everything has beauty, but not everyone can see. - Confucius",
  "How wonderful it is that nobody need wait a single moment before starting to improve the world. - Anne Frank",
  "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it. - Henry Ford",
  "It's not what you look at that matters, it's what you see. - Henry David Thoreau",
  "The two most important days in your life are the day you are born and the day you find out why. - Mark Twain",
  "Whatever you can do, or dream you can, begin it. Boldness has genius, power and magic in it. - Johann Wolfgang von Goethe",
  // Continue with more quotes to reach 365...
  "Nothing is impossible, the word itself says 'I'm possible'! - Audrey Hepburn",
  "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh",
  "Try not to become a person of success, but rather try to become a person of value. - Albert Einstein",
  "Great minds discuss ideas; average minds discuss events; small minds discuss people. - Eleanor Roosevelt",
  "I can't change the direction of the wind, but I can adjust my sails to always reach my destination. - Jimmy Dean",
  "If you don't like something, change it. If you can't change it, change your attitude. - Maya Angelou",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
  "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel. - Maya Angelou",
  "The two most important days in your life are the day you are born and the day you find out why. - Mark Twain",
  "Whether you think you can or you think you can't, you're right. - Henry Ford",
  "Perfection is not attainable, but if we chase perfection we can catch excellence. - Vince Lombardi",
  "Life is 10% what happens to you and 90% how you react to it. - Charles R. Swindoll",
  "If you want to lift yourself up, lift up someone else. - Booker T. Washington",
  "I have learned over the years that when one's mind is made up, this diminishes fear. - Rosa Parks",
  "I alone cannot change the world, but I can cast a stone across the water to create many ripples. - Mother Teresa",
  "Nothing is impossible, the word itself says, 'I'm possible!' - Audrey Hepburn",
  "The question isn't who is going to let me; it's who is going to stop me. - Ayn Rand",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "I've failed over and over and over again in my life and that is why I succeed. - Michael Jordan",
  "Start by doing what's necessary; then do what's possible; and suddenly you are doing the impossible. - Francis of Assisi",
  "Change your thoughts and you change your world. - Norman Vincent Peale",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "Success is not how high you have climbed, but how you make a positive difference to the world. - Roy T. Bennett",
  "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. - Ralph Waldo Emerson",
  // Adding more quotes to approach 365 total
  "Do not go where the path may lead, go instead where there is no path and leave a trail. - Ralph Waldo Emerson",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "Try to be a rainbow in someone's cloud. - Maya Angelou",
  "Do not let what you cannot do interfere with what you can do. - John Wooden",
  "A champion is defined not by their wins but by how they can recover when they fall. - Serena Williams",
  "You have been assigned this mountain to show others it can be moved. - Mel Robbins",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't wait for opportunity. Create it."
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
