const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Poll {
  _id: string;
  id: string;
  question: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalVotes: number;
  totalLikes: number;
  options: PollOption[];
}

export interface PollOption {
  id: string;
  text: string;
  order: number;
  votes: number;
  percentage: number;
}

export interface CreatePollData {
  question: string;
  options: string[];
  createdBy?: string;
}

// Get all polls
export async function getAllPolls(): Promise<Poll[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/polls`);
    const data = await response.json();
    return data.success ? data.polls : [];
  } catch (error) {
    console.error('Error fetching polls:', error);
    return [];
  }
}

// Get single poll
export async function getPoll(pollId: string): Promise<Poll | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/polls/${pollId}`);
    const data = await response.json();
    return data.success ? data.poll : null;
  } catch (error) {
    console.error('Error fetching poll:', error);
    return null;
  }
}

// Create poll
export async function createPoll(pollData: CreatePollData): Promise<Poll | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pollData),
    });
    const data = await response.json();
    return data.success ? data.poll : null;
  } catch (error) {
    console.error('Error creating poll:', error);
    return null;
  }
}

// Submit vote
export async function submitVote(pollId: string, userId: string, optionId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, optionId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting vote:', error);
    return { success: false };
  }
}

// Toggle like
export async function toggleLike(pollId: string, userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/polls/${pollId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false };
  }
}

// Check user vote
export async function getUserVote(pollId: string, userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/polls/${pollId}/vote/user?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error checking vote:', error);
    return { success: false, voted: false };
  }
}

// Check user like
export async function getUserLike(pollId: string, userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/polls/${pollId}/like/user?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error checking like:', error);
    return { success: false, liked: false };
  }
}