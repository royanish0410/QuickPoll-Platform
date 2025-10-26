import { Server, Socket } from 'socket.io';
import Poll from '../models/Poll';
import Vote from '../models/Vote';
import Like from '../models/Like';

async function getPollWithStats(pollId: string) {
  const poll = await Poll.findById(pollId);
  if (!poll) return null;

  const votes = await Vote.find({ pollId });
  const likes = await Like.countDocuments({ pollId });

  const voteCounts: Record<string, number> = {};
  poll.options.forEach(opt => { voteCounts[opt.id] = 0; });
  votes.forEach(vote => {
    if (voteCounts[vote.optionId] !== undefined) voteCounts[vote.optionId]++;
  });

  const totalVotes = votes.length;

  return {
    _id: poll._id,
    question: poll.question,
    createdBy: poll.createdBy,
    isActive: poll.isActive,
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
    totalVotes,
    totalLikes: likes,
    options: poll.options.map(opt => ({
      id: opt.id,
      text: opt.text,
      order: opt.order,
      votes: voteCounts[opt.id],
      percentage: totalVotes > 0 ? parseFloat(((voteCounts[opt.id] / totalVotes) * 100).toFixed(1)) : 0
    }))
  };
}

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Request all polls
    socket.on('request:polls', async () => {
      try {
        const polls = await Poll.find({ isActive: true }).sort({ createdAt: -1 });
        const pollsWithStats = await Promise.all(
          polls.map(poll => getPollWithStats(poll._id.toString()))
        );
        socket.emit('polls:list', pollsWithStats);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    });

    // Join poll room
    socket.on('join:poll', async (pollId: string) => {
      socket.join(`poll:${pollId}`);
      console.log(`User ${socket.id} joined poll ${pollId}`);
      
      try {
        const pollWithStats = await getPollWithStats(pollId);
        if (pollWithStats) {
          socket.emit('poll:data', pollWithStats);
        }
      } catch (error) {
        console.error('Error fetching poll data:', error);
      }
    });

    // Leave poll room
    socket.on('leave:poll', (pollId: string) => {
      socket.leave(`poll:${pollId}`);
      console.log(`User ${socket.id} left poll ${pollId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}
