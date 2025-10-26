"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import PollFeed from "@/components/poll-feed"
import CreatePollModal from "@/components/create-poll-modal"
import { initSocket, disconnectSocket } from "@/lib/socket"
import { fetchPolls, createPoll, votePoll, likePoll, type TransformedPoll } from "@/lib/api"

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [polls, setPolls] = useState<TransformedPoll[]>([])
  const [loading, setLoading] = useState(true)
  const [userVotes, setUserVotes] = useState<Record<string, number>>({})

  useEffect(() => {
    const loadPolls = async () => {
      setLoading(true)
      const fetchedPolls = await fetchPolls()
      setPolls(fetchedPolls)
      setLoading(false)
    }

    loadPolls()

    // Initialize Socket.IO connection
    const socket = initSocket()

    // Listen for poll updates from other users
    socket.on("pollUpdated", (updatedPoll: any) => {
      setPolls((prevPolls) => {
        const index = prevPolls.findIndex((p) => p.id === updatedPoll._id)
        if (index !== -1) {
          const newPolls = [...prevPolls]
          // Transform and update the poll
          const totalVotes = updatedPoll.options.reduce((sum: number, opt: any) => sum + opt.votes, 0)
          newPolls[index] = {
            ...newPolls[index],
            options: updatedPoll.options.map((opt: any, idx: number) => ({
              id: `opt${idx}`,
              text: opt.text,
              votes: opt.votes,
              percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
            })),
            totalVotes,
            likes: updatedPoll.likes,
          }
          return newPolls
        }
        return prevPolls
      })
    })

    return () => {
      disconnectSocket()
    }
  }, [])

  const handleCreatePoll = async (newPoll: { question: string; options: string[] }) => {
    const createdPoll = await createPoll(newPoll.question, newPoll.options)
    if (createdPoll) {
      setPolls([createdPoll, ...polls])
      setShowCreateModal(false)
    }
  }

  const handleVote = async (pollId: string, optionId: string) => {
    // Prevent duplicate votes
    if (userVotes[pollId] !== undefined) return

    const optionIndex = Number.parseInt(optionId.replace("opt", ""))
    const updatedPoll = await votePoll(pollId, optionIndex)

    if (updatedPoll) {
      setUserVotes({ ...userVotes, [pollId]: optionIndex })
      setPolls(polls.map((p) => (p.id === pollId ? updatedPoll : p)))
    }
  }

  const handleLike = async (pollId: string) => {
    const updatedPoll = await likePoll(pollId)
    if (updatedPoll) {
      setPolls(
        polls.map((p) => {
          if (p.id === pollId) {
            return {
              ...updatedPoll,
              liked: !p.liked,
            }
          }
          return p
        }),
      )
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onCreateClick={() => setShowCreateModal(true)} />
      <div className="mx-auto max-w-2xl px-4 py-8">
        {loading ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">Loading polls...</p>
          </div>
        ) : (
          <PollFeed polls={polls} onVote={handleVote} onLike={handleLike} />
        )}
      </div>
      <CreatePollModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onCreate={handleCreatePoll} />
    </main>
  )
}
