import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Play, Pause, RotateCcw, Square } from 'lucide-react';

const createTimer = (initialMinutes: number) => ({
  minutes: initialMinutes,
  seconds: 0,
  timeLeft: initialMinutes * 60,
  isRunning: false,
  isAlarmActive: false,
});

const FocusTimer = () => {
  const [timers, setTimers] = useState([
    createTimer(25),
    createTimer(5),
  ]);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    alarmRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
    alarmRef.current.loop = true;

    return () => {
      if (alarmRef.current) alarmRef.current.pause();
      if (alarmTimeoutRef.current) clearTimeout(alarmTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const intervals = timers.map((timer, index) => {
      if (timer.isRunning && timer.timeLeft > 0) {
        return setInterval(() => {
          setTimers((prev) => {
            const newTimers = [...prev];
            newTimers[index] = {
              ...newTimers[index],
              timeLeft: newTimers[index].timeLeft - 1,
            };
            return newTimers;
          });
        }, 1000);
      } else if (timer.timeLeft === 0 && timer.isRunning) {
        startAlarm(index);
      }
      return null;
    });

    return () => intervals.forEach((i) => i && clearInterval(i));
  }, [timers]);

  const startAlarm = (index: number) => {
    if (alarmRef.current) {
      alarmRef.current.play();
      setTimers((prev) => {
        const newTimers = [...prev];
        newTimers[index].isAlarmActive = true;
        newTimers[index].isRunning = false;
        return newTimers;
      });
      alarmTimeoutRef.current = setTimeout(() => stopAlarm(index), 60000);
    }
  };

  const stopAlarm = (index: number) => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
    setTimers((prev) => {
      const newTimers = [...prev];
      newTimers[index].isAlarmActive = false;
      return newTimers;
    });
    if (alarmTimeoutRef.current) clearTimeout(alarmTimeoutRef.current);
  };

  const toggleTimer = (index: number) => {
    setTimers((prev) => {
      const newTimers = [...prev];
      newTimers[index].isRunning = !newTimers[index].isRunning;
      return newTimers;
    });
  };

  const resetTimer = (index: number) => {
    setTimers((prev) => {
      const newTimers = [...prev];
      newTimers[index].isRunning = false;
      newTimers[index].timeLeft = newTimers[index].minutes * 60 + newTimers[index].seconds;
      newTimers[index].isAlarmActive = false;
      return newTimers;
    });
    if (alarmRef.current) alarmRef.current.pause();
  };

  const updateMinutes = (index: number, value: number) => {
    setTimers((prev) => {
      const newTimers = [...prev];
      newTimers[index].minutes = value;
      newTimers[index].timeLeft = value * 60 + newTimers[index].seconds;
      return newTimers;
    });
  };

  const updateSeconds = (index: number, value: number) => {
    setTimers((prev) => {
      const newTimers = [...prev];
      newTimers[index].seconds = value;
      newTimers[index].timeLeft = newTimers[index].minutes * 60 + value;
      return newTimers;
    });
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-3 pb-12 space-y-2 w-full">
      <div className="flex flex-col gap-2">
        {timers.map((timer, index) => (
          <div
            key={index}
            className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center"
          >
            <div className="flex items-center gap-2 mb-1">
              <Timer className="h-4 w-4 text-blue-600" />
              <h2 className="text-xs md:text-sm font-semibold text-gray-800 text-center">
                {index === 0 ? 'Focus Timer (25 min)' : 'Break Timer (5 min)'}
              </h2>
            </div>

            {timer.isAlarmActive ? (
              <div className="text-center">
                <div className="text-base md:text-lg font-bold text-red-600 mb-1">
                  {index === 0 ? "⏰ Time's up!" : "⏰ Break's over!"}
                </div>
                <div className="text-xs md:text-sm text-gray-700 mb-2">
                  {index === 0
                    ? "Stand up, stretch, and move!"
                    : "Go back to work/hustle."}
                </div>
                <Button
                  onClick={() => stopAlarm(index)}
                  variant="destructive"
                  size="sm"
                  className="text-xs px-2 h-6"
                >
                  <Square className="h-3 w-3 mr-1" /> Stop
                </Button>
              </div>
            ) : (
              <>
                <div className="text-2xl md:text-3xl font-mono font-bold text-gray-800 mb-2">
                  {formatTime(timer.timeLeft)}
                </div>

                {!timer.isRunning && (
                  <div className="flex gap-2 text-xs mb-2">
                    <Input
                      type="number"
                      value={timer.minutes}
                      onChange={(e) =>
                        updateMinutes(
                          index,
                          Math.max(0, parseInt(e.target.value) || 0)
                        )
                      }
                      className="w-14 md:w-16 h-8 text-xs bg-white border-gray-300 text-gray-900"
                      min="0"
                      max="99"
                      placeholder="min"
                    />
                    <Input
                      type="number"
                      value={timer.seconds}
                      onChange={(e) =>
                        updateSeconds(
                          index,
                          Math.max(
                            0,
                            Math.min(59, parseInt(e.target.value) || 0)
                          )
                        )
                      }
                      className="w-14 md:w-16 h-8 text-xs bg-white border-gray-300 text-gray-900"
                      min="0"
                      max="59"
                      placeholder="sec"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleTimer(index)}
                    size="sm"
                    className="text-xs px-2 h-7"
                  >
                    {timer.isRunning ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    onClick={() => resetTimer(index)}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 h-7"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FocusTimer;
