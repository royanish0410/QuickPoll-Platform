'use client';

import { PollOption as PollOptionType } from '@/lib/api';
import { Check, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface PollOptionProps {
  option: PollOptionType;
  isSelected: boolean;
  hasVoted: boolean;
  onVote: (optionId: string) => void;
  isLeading: boolean;
}

export default function PollOption({ option, isSelected, hasVoted, onVote, isLeading }: PollOptionProps) {
  return (
    <motion.button
      onClick={() => !hasVoted && onVote(option.id)}
      disabled={hasVoted}
      whileHover={!hasVoted ? { scale: 1.02, x: 5 } : {}}
      whileTap={!hasVoted ? { scale: 0.98 } : {}}
      className={`
        group relative w-full text-left p-4 rounded-xl border-2 transition-all
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20' 
          : hasVoted 
            ? 'border-gray-200 bg-white cursor-default' 
            : 'border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer bg-white'
        }
      `}
    >
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          {isSelected && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
          <span className="font-semibold text-gray-900 flex items-center gap-2">
            {option.text}
            {isLeading && hasVoted && (
              <TrendingUp className="w-4 h-4 text-green-600" />
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {hasVoted && (
            <span className="text-sm font-medium text-gray-600">
              {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
            </span>
          )}
          {hasVoted && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {option.percentage}%
            </span>
          )}
        </div>
      </div>

      {hasVoted && (
        <Progress 
          value={option.percentage} 
          className="h-2"
        />
      )}
    </motion.button>
  );
}