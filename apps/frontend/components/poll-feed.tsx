'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Poll, getAllPolls } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import PollCard from './poll-card';
import { Loader2, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PollFeed() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trending' | 'recent'>('all');

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

  const getFilteredPolls = () => {
    switch (filter) {
      case 'trending':
        return [...polls].sort((a, b) => b.totalVotes - a.totalVotes);
      case 'recent':
        return [...polls].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return polls;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading amazing polls...</p>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <div className="mb-6">
          <div className="w-24 h-24 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No polls yet</h3>
        <p className="text-gray-600 mb-6">Be the first to create an amazing poll!</p>
      </motion.div>
    );
  }

  const filteredPolls = getFilteredPolls();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="all" className="text-base">
            <Sparkles className="w-4 h-4 mr-2" />
            All Polls
          </TabsTrigger>
          <TabsTrigger value="trending" className="text-base">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-base">
            <Clock className="w-4 h-4 mr-2" />
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-6 mt-6">
          {filteredPolls.map((poll, index) => (
            <PollCard key={poll._id} poll={poll} onUpdate={loadPolls} index={index} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
