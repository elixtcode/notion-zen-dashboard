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

    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
    <div className="max-w-screen-sm mx-auto p-3 h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-green-600" />
        <h2 className="text-sm font-semibold text-gray-800">
          Activity Tracker
        </h2>
      </div>

      <div className="space-y-2 mb-3">
        <Input
          placeholder="Activity name"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          disabled={!!currentActivity}
          className="text-xs h-8"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={startActivity}
            disabled={!activityName.trim() || !!currentActivity}
            className="flex-1 text-xs h-8 min-w-[100px]"
          >
            <Play className="h-3 w-3 mr-1" />
            Start
          </Button>

          <Button
            onClick={stopActivity}
            disabled={!currentActivity}
            variant="destructive"
            className="flex-1 text-xs h-8 min-w-[100px]"
          >
            <Square className="h-3 w-3 mr-1" />
            Stop
          </Button>
        </div>

        {currentActivity && (
          <div className="bg-green-50 p-2 rounded text-xs">
            <div className="font-medium text-green-800">
              {currentActivity.name}
            </div>
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
              <div className="flex justify-between text-[11px] font-medium text-gray-600 border-b pb-1">
                <div className="truncate">Activity</div>
                <div className="text-right">Duration</div>
              </div>

              {activities.slice(0, 8).map((activity) => (
                <div
                  key={activity.id}
                  className="flex justify-between items-center gap-2 text-xs py-1 border-b border-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    {editing?.id === activity.id && editing.field === 'name' ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editing.value}
                          onChange={(e) =>
                            setEditing({ ...editing, value: e.target.value })
                          }
                          onKeyDown={handleKeyPress}
                          className="text-xs h-6 px-1 w-full"
                          autoFocus
                        />
                        <Button onClick={saveEdit} size="sm" className="h-6 w-6 p-0">
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-1 hover:bg-gray-50 px-1 py-0.5 rounded cursor-pointer"
                        onClick={() => startEditing(activity.id, 'name', activity.name)}
                      >
                        <span className="truncate font-medium text-gray-800">
                          {activity.name}
                        </span>
                        <Edit2 className="h-3 w-3 text-gray-400 shrink-0" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end min-w-[120px]">
                    {editing?.id === activity.id && editing.field === 'duration' ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editing.value}
                          onChange={(e) =>
                            setEditing({ ...editing, value: e.target.value })
                          }
                          onKeyDown={handleKeyPress}
                          className="text-xs h-6 px-1 w-20 text-right font-mono"
                          placeholder="HH:MM:SS"
                          autoFocus
                        />
                        <Button onClick={saveEdit} size="sm" className="h-6 w-6 p-0">
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div
                          className="flex items-center gap-1 hover:bg-gray-50 px-1 py-0.5 rounded cursor-pointer"
                          onClick={() =>
                            startEditing(
                              activity.id,
                              'duration',
                              formatDuration(activity.duration)
                            )
                          }
                        >
                          <span className="text-gray-600 font-mono truncate">
                            {formatDuration(activity.duration)}
                          </span>
                          <Edit2 className="h-3 w-3 text-gray-400 shrink-0" />
                        </div>
                        <Button
                          onClick={() => handleDelete(activity.id)}
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;
