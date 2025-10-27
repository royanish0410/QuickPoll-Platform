'use client';

import { useState, useEffect } from 'react';
import { Poll, getAllPolls } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import PollCard from './poll-card';
import { Loader2 } from 'lucide-react';

export default function PollFeed() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolls();
    setupSocketListeners();

    return () => {
      const socket = getSocket();
      socket.off('poll:created');
      socket.off('vote:updated');
      socket.off('like:updated');
    };
  }, []);

  const loadPolls = async () => {
    setLoading(true);
    const data = await getAllPolls();
    setPolls(data);
    setLoading(false);
  };

  const setupSocketListeners = () => {
    const socket = getSocket();

    socket.on('poll:created', (newPoll: Poll) => {
      setPolls((prev) => [newPoll, ...prev]);
    });

    socket.on('vote:updated', (data: any) => {
      setPolls((prev) =>
        prev.map((poll) => (poll._id === data.pollId ? data.poll : poll))
      );
    });

    socket.on('like:updated', (data: any) => {
      setPolls((prev) =>
        prev.map((poll) => (poll._id === data.pollId ? data.poll : poll))
      );
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg mb-4">No polls yet</p>
        <p className="text-gray-500">Create the first poll to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {polls.map((poll) => (
        <PollCard key={poll._id} poll={poll} onUpdate={loadPolls} />
      ))}
    </div>
  );
}