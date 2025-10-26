const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

export interface BackendPoll {
  _id: string
  question: string
  options: Array<{
    text: string
    votes: number
  }>
  likes: number
  createdAt: string
}

export interface TransformedPoll {
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

// Transform backend poll to frontend format
export const transformPoll = (poll: BackendPoll): TransformedPoll => {
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0)
  return {
    id: poll._id,
    question: poll.question,
    options: poll.options.map((opt, idx) => ({
      id: `opt${idx}`,
      text: opt.text,
      votes: opt.votes,
      percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
    })),
    totalVotes,
    likes: poll.likes,
    liked: false,
    userVoted: false,
    createdAt: new Date(poll.createdAt),
    author: "Anonymous",
  }
}

const fetchOptions = {
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include" as const,
}

// Fetch all polls
export const fetchPolls = async (): Promise<TransformedPoll[]> => {
  try {
    console.log("[v0] Fetching polls from:", BACKEND_URL)
    const response = await fetch(`${BACKEND_URL}/api/polls`, {
      ...fetchOptions,
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const polls: BackendPoll[] = await response.json()
    console.log("[v0] Polls fetched successfully:", polls.length)
    return polls.map(transformPoll)
  } catch (error) {
    console.error("[v0] Error fetching polls:", error)
    console.error("[v0] Backend URL:", BACKEND_URL)
    console.error("[v0] Make sure backend is running and CORS is configured")
    return []
  }
}

// Create a new poll
export const createPoll = async (question: string, options: string[]): Promise<TransformedPoll | null> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/polls`, {
      ...fetchOptions,
      method: "POST",
      body: JSON.stringify({ question, options }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    const poll: BackendPoll = await response.json()
    return transformPoll(poll)
  } catch (error) {
    console.error("[v0] Error creating poll:", error)
    return null
  }
}

// Vote on a poll
export const votePoll = async (pollId: string, optionIndex: number): Promise<TransformedPoll | null> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/polls/${pollId}/vote`, {
      ...fetchOptions,
      method: "PATCH",
      body: JSON.stringify({ optionIndex }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    const poll: BackendPoll = await response.json()
    return transformPoll(poll)
  } catch (error) {
    console.error("[v0] Error voting:", error)
    return null
  }
}

// Like a poll
export const likePoll = async (pollId: string): Promise<TransformedPoll | null> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/polls/${pollId}/like`, {
      ...fetchOptions,
      method: "PATCH",
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    const poll: BackendPoll = await response.json()
    return transformPoll(poll)
  } catch (error) {
    console.error("[v0] Error liking poll:", error)
    return null
  }
}
