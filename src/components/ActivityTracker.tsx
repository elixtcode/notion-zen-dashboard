import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Play, Square, Edit2, Check, X } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
}

interface EditingState {
  id: string;
  field: 'name' | 'duration';
  value: string;
}

const ActivityTracker = () => {
  const [activityName, setActivityName] = useState('');
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('activities');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setActivities(
            parsed.map((a: any) => ({
              ...a,
              startTime: new Date(a.startTime),
              endTime: a.endTime ? new Date(a.endTime) : undefined,
            }))
          );
        }
      }
    } catch (error) {
      console.error('Failed to parse activities from localStorage', error);
    }
  }, []);

  // Save to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  // Track elapsed time if activity is running
  useEffect(() => {
    if (!currentActivity) return;

    const updateElapsed = () =>
      setElapsedSeconds(Math.floor((Date.now() - currentActivity.startTime.getTime()) / 1000));

    updateElapsed(); // immediate sync

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentActivity]);

  const startActivity = () => {
    if (!activityName.trim()) return;

    const newActivity: Activity = {
      id: Date.now().toString(),
      name: activityName.trim(),
      startTime: new Date(),
      duration: 0,
    };

    setCurrentActivity(newActivity);
    setElapsedSeconds(0);
    setActivityName('');
  };

  const stopActivity = () => {
    if (!currentActivity) return;

    const endTime = new Date();
    const durationInSeconds = Math.round(
      (endTime.getTime() - currentActivity.startTime.getTime()) / 1000
    );

    const completedActivity = {
      ...currentActivity,
      endTime,
      duration: durationInSeconds,
    };

    setActivities((prev) => [completedActivity, ...prev]);
    setCurrentActivity(null);
    setElapsedSeconds(0);
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  const parseDuration = (timeString: string): number => {
    const parts = timeString.split(':').map((p) => p.trim());
    if (parts.length !== 3) return 0;

    const [h, m, s] = parts.map((part) => parseInt(part, 10));
    if ([h, m, s].some((n) => isNaN(n) || n < 0)) return 0;

    return h * 3600 + m * 60 + s;
  };

  const totalDuration = useMemo(() => {
    return activities.reduce((sum, a) => sum + a.duration, 0);
  }, [activities]);

  const getTotalTime = () => formatDuration(totalDuration);

  const startEditing = (id: string, field: 'name' | 'duration', currentValue: string) => {
    setEditing({ id, field, value: currentValue });
  };

  const cancelEditing = () => {
    setEditing(null);
  };

  const saveEdit = () => {
    if (!editing) return;

    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === editing.id) {
          if (editing.field === 'name') {
            return { ...activity, name: editing.value.trim() || activity.name };
          } else if (editing.field === 'duration') {
            const newDuration = parseDuration(editing.value);
            return {
              ...activity,
              duration: newDuration > 0 ? newDuration : activity.duration,
            };
          }
        }
        return activity;
      })
    );

    setEditing(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    else if (e.key === 'Escape') cancelEditing();
  };

  // JSX remains unchanged from your latest version (retains styling/structure)

  return (
    // ... unchanged JSX (same as your latest input)
    // paste your full JSX here or let me know if you want that re-included too
    <></> // placeholder
  );
};

export default ActivityTracker;
