
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

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

const FocusTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');

  useEffect(() => {
    setTimeLeft(minutes * 60 + seconds);
  }, [minutes, seconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      playAlarm();
      showRandomVideo();
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const playAlarm = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start();
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
    setTimeLeft(minutes * 60 + seconds);
    setShowVideo(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="h-4 w-4 text-blue-600" />
        <h2 className="text-sm font-semibold text-gray-800">Focus Timer</h2>
      </div>

      {!showVideo ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="text-3xl font-mono font-bold text-gray-800">
            {formatTime(timeLeft)}
          </div>

          {!isRunning && (
            <div className="flex gap-2 text-xs">
              <Input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 h-8 text-xs"
                min="0"
                max="99"
                placeholder="min"
              />
              <Input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-16 h-8 text-xs"
                min="0"
                max="59"
                placeholder="sec"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={toggleTimer} size="sm" className="text-xs">
              {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="sm" className="text-xs">
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">5-Minute Exercise Break</span>
            <Button onClick={() => setShowVideo(false)} variant="outline" size="sm" className="text-xs">
              Close
            </Button>
          </div>
          <div className="flex-1 relative">
            <iframe
              id="exercise-video"
              src={currentVideo}
              className="w-full h-full rounded"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusTimer;
