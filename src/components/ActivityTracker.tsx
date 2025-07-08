
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Play, Square } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
}

const ActivityTracker = () => {
  const [activityName, setActivityName] = useState('');
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

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
    const duration = Math.round((endTime.getTime() - currentActivity.startTime.getTime()) / 1000 / 60);
    
    const completedActivity = {
      ...currentActivity,
      endTime,
      duration
    };
    
    setActivities(prev => [completedActivity, ...prev.slice(0, 4)]);
    setCurrentActivity(null);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="p-4 h-full flex flex-col">
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
          className="text-xs h-8"
        />
        
        <div className="flex gap-2">
          <Button 
            onClick={startActivity} 
            disabled={!activityName.trim() || !!currentActivity}
            className="flex-1 text-xs h-8"
            size="sm"
          >
            <Play className="h-3 w-3 mr-1" />
            Start
          </Button>
          
          <Button 
            onClick={stopActivity} 
            disabled={!currentActivity}
            variant="destructive"
            className="flex-1 text-xs h-8"
            size="sm"
          >
            <Square className="h-3 w-3 mr-1" />
            Stop
          </Button>
        </div>

        {currentActivity && (
          <div className="bg-green-50 p-2 rounded text-xs">
            <div className="font-medium text-green-800">{currentActivity.name}</div>
            <div className="text-green-600">Started at {currentActivity.startTime.toLocaleTimeString()}</div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="text-xs font-medium text-gray-600 mb-2">Recent Activities</div>
        <div className="space-y-2">
          {activities.length === 0 ? (
            <div className="text-xs text-gray-500 text-center py-4">No activities logged yet</div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="bg-gray-50 p-2 rounded text-xs">
                <div className="font-medium text-gray-800">{activity.name}</div>
                <div className="text-gray-600">
                  {formatDuration(activity.duration)} • {activity.startTime.toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;
