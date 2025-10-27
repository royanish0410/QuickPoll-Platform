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
      className="top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm sticky"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          {/* Logo + Title */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50"></div>
              <div className="relative bg-linear-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                QuickPoll
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Real-time polling platform</p>
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Live
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge variant="outline" className="text-xs sm:text-sm hidden sm:flex">
              {totalPolls} Active {totalPolls === 1 ? 'Poll' : 'Polls'}
            </Badge>
            <Button 
              onClick={onCreatePoll}
              size="sm"
              className="sm:size-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Create Poll</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
