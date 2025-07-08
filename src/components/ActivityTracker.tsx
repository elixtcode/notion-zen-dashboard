import React, { useState, useEffect } from 'react';
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
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) {
      const parsed = JSON.parse(stored);
      setActivities(
        parsed.map((a: any) => ({
          ...a,
          startTime: new Date(a.startTime),
          endTime: a.endTime ? new Date(a.endTime) : undefined,
        }))
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentActivity) {
      interval = setInterval(() => {
        setElapsed(
          Math.round((Date.now() - currentActivity.startTime.getTime()) / 1000)
        );
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [currentActivity]);

  const startActivity = () => {
    if (!activityName.trim()) return;
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: activityName,
      startTime: new Date(),
      duration: 0,
    };
    setCurrentActivity(newActivity);
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
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
    }
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
    const totalSeconds = activities.reduce(
      (sum, activity) => sum + activity.duration,
      0
    );
    return formatDuration(totalSeconds);
  };

  const startEditing = (
    id: string,
    field: 'name' | 'duration',
    currentValue: string
  ) => {
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
            return {
              ...activity,
              name: editing.value.trim() || activity.name,
            };
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
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="p-4 h-full flex flex-col max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-green-600" />
        <h2 className="text-sm font-semibold text-gray-800">Activity Tracker</h2>
      </div>

      <div className="space-y-3 mb-4">
        <Input
          placeholder="Activity name"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          disabled={!!currentActivity}
          className="text-xs h-10 sm:h-8"
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={startActivity}
            disabled={!activityName.trim() || !!currentActivity}
            className="flex-1 text-xs h-10 sm:h-8"
            size="sm"
          >
            <Play className="h-4 w-4 mr-1" />
            Start
          </Button>

          <Button
            onClick={stopActivity}
            disabled={!currentActivity}
            variant="destructive"
            className="flex-1 text-xs h-10 sm:h-8"
            size="sm"
          >
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>
        </div>

        {currentActivity && (
          <div className="bg-green-50 p-2 rounded text-xs">
            <div className="font-medium text-green-800">{currentActivity.name}</div>
            <div className="text-green-600">
              Started at {currentActivity.startTime.toLocaleTimeString()}
            </div>
            <div className="text-green-600 font-mono">
              Elapsed: {formatDuration(elapsed)}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activities.length > 0 && (
          <div className="mb-3 text-center">
            <div className="text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
              Total Time Logged: {getTotalTime()}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {activities.length === 0 ? (
            <div className="text-xs text-gray-500 text-center py-4">
              No activities logged yet
            </div>
          ) : (
            <div className="space-y-1">
              {activities.map((activity) => (
                // ... rest of activity rendering code remains unchanged
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;
