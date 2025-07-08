import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Play, Square, Edit2, Check, X, Download } from 'lucide-react';

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
  const [visibleCount, setVisibleCount] = useState(3);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) {
      const parsed = JSON.parse(stored);
      setActivities(parsed.map((a: any) => ({
        ...a,
        startTime: new Date(a.startTime),
        endTime: a.endTime ? new Date(a.endTime) : undefined
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  // Live timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentActivity) {
      setElapsedSeconds(Math.floor((Date.now() - currentActivity.startTime.getTime()) / 1000));
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentActivity]);

  const startActivity = () => {
    if (!activityName.trim()) return;
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: activityName,
      startTime: new Date(),
      duration: 0
    };
    setCurrentActivity(newActivity);
    setActivityName('');
  };

  const stopActivity = () => {
    if (!currentActivity) return;
    const endTime = new Date();
    const durationInSeconds = Math.round((endTime.getTime() - currentActivity.startTime.getTime()) / 1000);
    const completedActivity = {
      ...currentActivity,
      endTime,
      duration: durationInSeconds
    };
    setActivities(prev => [completedActivity, ...prev]);
    setCurrentActivity(null);
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const parseDuration = (timeString: string): number => {
    const parts = timeString.split(':');
    if (parts.length !== 3) return 0;
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  const getTotalTime = () => {
    const totalSeconds = activities.reduce((sum, activity) => sum + activity.duration, 0);
    return formatDuration(totalSeconds);
  };

  const startEditing = (id: string, field: 'name' | 'duration', currentValue: string) => {
    setEditing({ id, field, value: currentValue });
  };

  const cancelEditing = () => {
    setEditing(null);
  };

  const saveEdit = () => {
    if (!editing) return;
    setActivities(prev => prev.map(activity => {
      if (activity.id === editing.id) {
        if (editing.field === 'name') {
          return { ...activity, name: editing.value.trim() || activity.name };
        } else if (editing.field === 'duration') {
          const newDuration = parseDuration(editing.value);
          return { ...activity, duration: newDuration > 0 ? newDuration : activity.duration };
        }
      }
      return activity;
    }));
    setEditing(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    else if (e.key === 'Escape') cancelEditing();
  };

  const exportToCSV = () => {
    const header = 'Name,Start Time,End Time,Duration (seconds)';
    const rows = activities.map(a => {
      return `${a.name},${a.startTime.toISOString()},${a.endTime?.toISOString() || ''},${a.duration}`;
    });
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'activity_log.csv');
    link.click();
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-green-600" />
          <h2 className="text-sm font-semibold text-gray-800">Activity Tracker</h2>
        </div>
        {activities.length > 0 && (
          <Button onClick={exportToCSV} size="sm" className="h-7 px-2 text-xs">
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <Input
          placeholder="Activity name"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          disabled={!!currentActivity}
          className="text-xs h-8"
        />
        <div className="flex gap-2">
          <Button onClick={startActivity} disabled={!activityName.trim() || !!currentActivity} className="flex-1 text-xs h-8">
            <Play className="h-3 w-3 mr-1" /> Start
          </Button>
          <Button onClick={stopActivity} disabled={!currentActivity} variant="destructive" className="flex-1 text-xs h-8">
            <Square className="h-3 w-3 mr-1" /> Stop
          </Button>
        </div>
        {currentActivity && (
          <div className="bg-green-50 p-3 rounded text-xs">
            <div className="font-medium text-green-800">{currentActivity.name}</div>
            <div className="text-green-600">
              Started at {currentActivity.startTime.toLocaleTimeString()}
            </div>
            <div className="text-green-800 font-mono mt-1">
              ⏱ Elapsed: {formatDuration(elapsedSeconds)}
            </div>
          </div>
        )}
      </div>

      {/* Remaining component unchanged */}
      {/* Activities list, editing, and show more button */}
      {/* You already have the editing UI improvements and CSV export in place */}
      {/* Omitted here for brevity; keep your existing implementation for the activity list UI */}
    </div>
  );
};

export default ActivityTracker;
