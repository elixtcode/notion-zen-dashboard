
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Plus, Trash2 } from 'lucide-react';

interface TimeEntry {
  id: string;
  task: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
}

const TimeLogger = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [newTask, setNewTask] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Load entries from localStorage on component mount
  useEffect(() => {
    const today = new Date().toDateString();
    const storedEntries = localStorage.getItem(`timeEntries_${today}`);
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`timeEntries_${today}`, JSON.stringify(entries));
  }, [entries]);

  const calculateDuration = (start: string, end: string): number => {
    const startDate = new Date(`2000-01-01 ${start}`);
    const endDate = new Date(`2000-01-01 ${end}`);
    const diff = endDate.getTime() - startDate.getTime();
    return Math.max(0, Math.round(diff / (1000 * 60))); // Convert to minutes
  };

  const addTimeEntry = () => {
    if (!newTask || !startTime || !endTime) return;

    const duration = calculateDuration(startTime, endTime);
    if (duration <= 0) return;

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      task: newTask,
      startTime,
      endTime,
      duration
    };

    setEntries([...entries, newEntry]);
    setNewTask('');
    setStartTime('');
    setEndTime('');
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const totalHours = entries.reduce((total, entry) => total + entry.duration, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-200 h-fit">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-800">Time Logger</h2>
      </div>

      {/* Add New Entry Form */}
      <div className="space-y-3 mb-6">
        <Input
          placeholder="Task description"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border-gray-300"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Start Time</label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border-gray-300"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">End Time</label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border-gray-300"
            />
          </div>
        </div>
        <Button 
          onClick={addTimeEntry} 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={!newTask || !startTime || !endTime}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Total Time */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="text-sm text-gray-600">Total Time Today</div>
        <div className="text-2xl font-bold text-gray-800">
          {formatDuration(totalHours)}
        </div>
      </div>

      {/* Time Entries */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No time entries yet today
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">{entry.task}</div>
                <div className="text-xs text-gray-600">
                  {entry.startTime} - {entry.endTime} ({formatDuration(entry.duration)})
                </div>
              </div>
              <Button
                onClick={() => removeEntry(entry.id)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default TimeLogger;
