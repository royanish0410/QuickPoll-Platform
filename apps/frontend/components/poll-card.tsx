"use client"

import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import PollOption from "./poll-option"
import { formatDistanceToNow } from "date-fns"

interface Poll {
  id: string
  question: string
  options: Array<{
    id: string
    text: string
    votes: number
    percentage: number
  }>
  totalVotes: number
  likes: number
  liked: boolean
  userVoted: boolean
  userVote?: string
  createdAt: Date
  author: string
}

interface PollCardProps {
  poll: Poll
  onVote: (pollId: string, optionId: string) => void
  onLike: (pollId: string) => void
}

export default function PollCard({ poll, onVote, onLike }: PollCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{poll.question}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            by {poll.author} • {formatDistanceToNow(poll.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="mb-6 space-y-3">
        {poll.options.map((option) => (
          <PollOption
            key={option.id}
            option={option}
            isSelected={poll.userVote === option.id}
            userVoted={poll.userVoted}
            onClick={() => !poll.userVoted && onVote(poll.id, option.id)}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span>{poll.totalVotes.toLocaleString()} votes</span>
        <span>•</span>
        <span>{poll.likes.toLocaleString()} likes</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => onLike(poll.id)}
        >
          <Heart className={`h-4 w-4 ${poll.liked ? "fill-red-500 text-red-500" : ""}`} />
          Like
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-foreground">
          <MessageCircle className="h-4 w-4" />
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-foreground">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  )
}
