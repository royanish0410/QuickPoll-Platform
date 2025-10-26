import { Request, Response, NextFunction } from 'express';
import Poll from '../models/Poll';
import Like from '../models/Like';
import Vote from '../models/Vote';

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

export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pollId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({
        success: false,
        error: 'Poll not found'
      });
    }

    const existingLike = await Like.findOne({ pollId, userId });
    let liked = false;

    if (existingLike) {
      await existingLike.deleteOne();
      liked = false;
    } else {
      await Like.create({ pollId, userId });
      liked = true;
    }

    const pollWithStats = await getPollWithStats(pollId);

    const io = req.app.get('io');
    io.emit('like:updated', {
      pollId,
      userId,
      liked,
      poll: pollWithStats
    });

    res.json({
      success: true,
      liked,
      totalLikes: pollWithStats?.totalLikes || 0
    });
  } catch (error) {
    next(error);
  }
};

export const checkUserLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pollId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const like = await Like.findOne({ pollId, userId: userId as string });

    res.json({
      success: true,
      liked: !!like
    });
  } catch (error) {
    next(error);
  }
};