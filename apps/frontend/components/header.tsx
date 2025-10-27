'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onCreatePoll: () => void;
  totalPolls: number;
}

export default function Header({ onCreatePoll, totalPolls }: HeaderProps) {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QuickPoll
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">Real-time polling platform</p>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex">
              {totalPolls} Active {totalPolls === 1 ? 'Poll' : 'Polls'}
            </Badge>
            <Button 
              onClick={onCreatePoll}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Poll
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}