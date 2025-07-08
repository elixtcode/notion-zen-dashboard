
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw, Youtube } from 'lucide-react';

const workoutVideos = [
  "https://www.youtube.com/embed/L_xrDAtykMI",
  "https://www.youtube.com/embed/dZgVxmf6jkA",
  "https://www.youtube.com/embed/qHJ992N-Dhs",
  "https://www.youtube.com/embed/OAJ_J3EZkdY",
  "https://www.youtube.com/embed/WG0vNENlV5E",
  "https://www.youtube.com/embed/XWXe0fU5x8o",
  "https://www.youtube.com/embed/MBjmuJhQ4Yw",
  "https://www.youtube.com/embed/l0WOLpbf2dM",
  "https://www.youtube.com/embed/HYcXy58xU_E",
  "https://www.youtube.com/embed/Gpmy2P9Cg6A"
];

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time's up - play alarm and show video
      playAlarm();
      if (isWorkTime) {
        showRandomVideo();
      }
      // Auto-switch to break/work
      const nextTime = isWorkTime ? 5 * 60 : 25 * 60;
      setTimeLeft(nextTime);
      setIsWorkTime(!isWorkTime);
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWorkTime]);

  const playAlarm = () => {
    // Create a loud alarm sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start();
    
    // Beep pattern
    setTimeout(() => oscillator.stop(), 200);
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.setValueAtTime(600, audioContext.currentTime);
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      osc2.start();
      setTimeout(() => osc2.stop(), 200);
    }, 300);
  };

  const showRandomVideo = () => {
    const randomVideo = workoutVideos[Math.floor(Math.random() * workoutVideos.length)];
    setCurrentVideo(randomVideo);
    setShowVideo(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorkTime ? 25 * 60 : 5 * 60);
    setShowVideo(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((isWorkTime ? 25 * 60 : 5 * 60) - timeLeft) / (isWorkTime ? 25 * 60 : 5 * 60) * 100;

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Pomodoro Timer</h2>
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {isWorkTime ? 'Work Time' : 'Break Time'}
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className="text-6xl font-mono font-bold text-gray-800 mb-4">
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              isWorkTime ? 'bg-blue-600' : 'bg-green-600'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={toggleTimer} 
            className={`px-6 py-3 ${
              isWorkTime ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline" className="px-6 py-3">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Exercise Video */}
      {showVideo && (
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Youtube className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">5-Minute Exercise Break</h3>
            <Button 
              onClick={() => setShowVideo(false)} 
              variant="outline" 
              size="sm"
              className="ml-auto"
            >
              Close
            </Button>
          </div>
          <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
            <iframe
              id="exercise-video"
              src={currentVideo}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PomodoroTimer;
