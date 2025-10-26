"use client"

import { cn } from "@/lib/utils"

interface Option {
  id: string
  text: string
  votes: number
  percentage: number
}

interface PollOptionProps {
  option: Option
  isSelected: boolean
  userVoted: boolean
  onClick: () => void
}

export default function PollOption({ option, isSelected, userVoted, onClick }: PollOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={userVoted}
      className={cn(
        "relative w-full overflow-hidden rounded-lg border-2 p-4 text-left transition-all",
        userVoted
          ? "cursor-default border-border"
          : "border-border hover:border-primary hover:bg-muted/50 cursor-pointer",
        isSelected && "border-primary bg-primary/10",
      )}
    >
      {/* Background bar */}
      <div
        className={cn("absolute inset-0 transition-all", isSelected ? "bg-primary/20" : "bg-muted/30")}
        style={{ width: `${option.percentage}%` }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-between">
        <span className="font-medium text-foreground">{option.text}</span>
        <span className="text-sm font-semibold text-muted-foreground">{option.percentage}%</span>
      </div>

      {/* Vote count */}
      {userVoted && (
        <div className="relative mt-2 text-xs text-muted-foreground">
          {option.votes.toLocaleString()} {option.votes === 1 ? "vote" : "votes"}
        </div>
      )}
    </button>
  )
}
