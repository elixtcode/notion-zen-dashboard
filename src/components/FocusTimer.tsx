
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Play, Pause, RotateCcw, Square } from 'lucide-react';

const FocusTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize alarm audio
    alarmRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
    alarmRef.current.loop = true;
    
    return () => {
      if (alarmRef.current) {
        alarmRef.current.pause();
        alarmRef.current = null;
      }
      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current);
      }
    };
  }, []);

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
      startAlarm();
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.play();
      setIsAlarmActive(true);
      
      // Auto stop alarm after 60 seconds
      alarmTimeoutRef.current = setTimeout(() => {
        stopAlarm();
      }, 60000);
    }
  };

  const stopAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
    setIsAlarmActive(false);
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(minutes * 60 + seconds);
    stopAlarm();
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

      {isAlarmActive ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">⏰ Time's up!</div>
            <div className="text-sm text-gray-700 mb-4">
              Stand up, stretch, and move around for 5 minutes.
            </div>
            <Button onClick={stopAlarm} variant="destructive" className="text-sm">
              <Square className="h-3 w-3 mr-1" />
              Stop Alarm
            </Button>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default FocusTimer;
