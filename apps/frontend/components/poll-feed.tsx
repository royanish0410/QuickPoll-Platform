"use client"

import PollCard from "./poll-card"

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

interface PollFeedProps {
  polls: Poll[]
  onVote: (pollId: string, optionId: string) => void
  onLike: (pollId: string) => void
}

export default function PollFeed({ polls, onVote, onLike }: PollFeedProps) {
  return (
    <div className="space-y-4">
      {polls.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No polls yet. Create one to get started!</p>
        </div>
      ) : (
        polls.map((poll) => <PollCard key={poll.id} poll={poll} onVote={onVote} onLike={onLike} />)
      )}
    </div>
  )
}
