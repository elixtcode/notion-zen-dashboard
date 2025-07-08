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
      {/* header + CSV */}
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

      {/* input + buttons */}
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
          <div>
            <div className="text-green-600 text-xs font-semibold mb-1 animate-pulse">🟢 Running Time</div>
            <div className="bg-green-50 p-2 rounded text-xs">
              <div className="font-medium text-green-800">{currentActivity.name}</div>
              <div className="text-green-600">Started at {currentActivity.startTime.toLocaleTimeString()}</div>
            </div>
          </div>
        )}
      </div>

      {/* activity list */}
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
            <div className="text-xs text-gray-500 text-center py-4">No activities logged yet</div>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-600 border-b pb-1">
                <div>Activity</div>
                <div className="text-right col-span-2">Duration</div>
              </div>
              {activities.slice(0, visibleCount).map((activity) => (
                <div key={activity.id} className="grid grid-cols-3 gap-2 text-xs py-1 border-b border-gray-100">
                  <div className="flex items-center">
                    {editing?.id === activity.id && editing.field === 'name' ? (
                      <div className="flex items-center gap-1 flex-1">
                        <Input
                          value={editing.value}
                          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                          onKeyDown={handleKeyPress}
                          className="text-xs h-6 px-2 w-full"
                          autoFocus
                        />
                        <div className="flex gap-1 w-1/2">
                          <Button onClick={saveEdit} size="sm" className="h-6 w-full text-xs">
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button onClick={cancelEditing} size="sm" variant="outline" className="h-6 w-full text-xs">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div onClick={() => startEditing(activity.id, 'name', activity.name)} className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 p-1 rounded flex-1">
                        <span className="font-medium text-gray-800 truncate w-full">{activity.name}</span>
                        <Edit2 className="h-3 w-3 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-1">
                    {editing?.id === activity.id && editing.field === 'duration' ? (
                      <>
                        <Input
                          value={editing.value}
                          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                          onKeyDown={handleKeyPress}
                          className="text-xs h-6 px-2 w-24 text-right font-mono"
                          placeholder="HH:MM:SS"
                          autoFocus
                        />
                        <div className="flex gap-1 w-1/2">
                          <Button onClick={saveEdit} size="sm" className="h-6 w-full text-xs">
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button onClick={cancelEditing} size="sm" variant="outline" className="h-6 w-full text-xs">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div onClick={() => startEditing(activity.id, 'duration', formatDuration(activity.duration))} className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <span className="text-gray-600 font-mono">{formatDuration(activity.duration)}</span>
                          <Edit2 className="h-3 w-3 text-gray-400" />
                        </div>
                        <Button onClick={() => deleteActivity(activity.id)} size="sm" variant="outline" className="h-6 px-1 text-xs">
                          ✕
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {activities.length > visibleCount && (
                <div className="text-center">
                  <Button onClick={() => setVisibleCount(c => c + 3)} size="sm" variant="outline" className="mt-2 h-7 text-xs">
                    Show more
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;
