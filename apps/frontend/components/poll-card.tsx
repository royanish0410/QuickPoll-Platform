'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Poll } from '@/lib/api'
import { submitVote, toggleLike, getUserVote, getUserLike } from '@/lib/api'
import { generateUserId, formatDate, getGradientByIndex } from '@/lib/utils'
import { Heart, Users, Clock, Sparkles, Check } from 'lucide-react'
import PollOption from './poll-option'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Confetti from 'react-confetti'

interface PollCardProps {
  poll: Poll
  onUpdate?: () => void
  index: number
}

export default function PollCard({ poll, onUpdate, index }: PollCardProps) {
  const [userId] = useState(() => generateUserId())
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(poll.totalLikes)
  const [voting, setVoting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    checkUserInteractions()
  }, [poll._id])

  const checkUserInteractions = async () => {
    const [voteResult, likeResult] = await Promise.all([
      getUserVote(poll._id, userId),
      getUserLike(poll._id, userId),
    ])

    if (voteResult.voted) {
      setSelectedOption(voteResult.optionId)
      setHasVoted(true)
    }

    setIsLiked(likeResult.liked)
  }

  const handleVote = async (optionId: string) => {
    if (voting || hasVoted) return

    setVoting(true)
    const result = await submitVote(poll._id, userId, optionId)

    if (result.success) {
      setSelectedOption(optionId)
      setHasVoted(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)

      toast.success('Vote Recorded 🎉', {
        description: 'Your vote has been counted successfully.',
      })

      onUpdate?.()
    } else {
      toast.error('Failed to record vote.')
    }

    setVoting(false)
  }

  const handleLike = async () => {
    const result = await toggleLike(poll._id, userId)
    if (result.success) {
      setIsLiked(result.liked)
      setLikes(result.totalLikes)
      onUpdate?.()
    }
  }

  const leadingOption = poll.options.reduce(
    (max, opt) => (opt.votes > max.votes ? opt : max),
    poll.options[0]
  )

  const initials = poll.createdBy.substring(0, 2).toUpperCase()

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2">
          <div className={`h-2 bg-linear-to-r ${getGradientByIndex(index)}`} />

          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Avatar className={`bg-linear-to-r ${getGradientByIndex(index)}`}>
                  <AvatarFallback className="text-white font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{poll.question}</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(poll.createdAt)}
                    </Badge>
                    <span className="text-sm text-gray-600">by {poll.createdBy}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              {poll.options.map((option) => (
                <PollOption
                  key={option.id}
                  option={option}
                  isSelected={selectedOption === option.id}
                  hasVoted={hasVoted}
                  onVote={handleVote}
                  isLeading={hasVoted && option.id === leadingOption.id && poll.totalVotes > 0}
                />
              ))}
            </div>

            {!hasVoted && (
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Click on an option to cast your vote</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <Button
                  variant={isLiked ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleLike}
                  className={
                    isLiked
                      ? 'bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
                      : ''
                  }
                >
                  <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {likes}
                </Button>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{poll.totalVotes} votes</span>
                </div>
              </div>

              {hasVoted && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 flex items-center"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Voted
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
