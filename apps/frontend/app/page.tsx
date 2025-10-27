'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import PollFeed from '@/components/poll-feed';
import CreatePollModal from '@/components/create-poll-modal';
import { Toaster } from '@/components/ui/toaster';
import { getAllPolls } from '@/lib/api';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalPolls, setTotalPolls] = useState(0);

  useEffect(() => {
    loadPollCount();
  }, [refreshKey]);

  const loadPollCount = async () => {
    const polls = await getAllPolls();
    setTotalPolls(polls.length);
  };

  const handlePollCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header onCreatePoll={() => setIsModalOpen(true)} totalPolls={totalPolls} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PollFeed key={refreshKey} />
      </main>

      <CreatePollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPollCreated={handlePollCreated}
      />

      <Toaster />

      {/* Floating Background Elements */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="fixed top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="fixed -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  );
}