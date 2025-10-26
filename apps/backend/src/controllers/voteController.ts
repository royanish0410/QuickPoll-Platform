import { Request, Response, NextFunction } from 'express';
import Poll from '../models/Poll';
import Vote from '../models/Vote';

async function getPollWithStats(pollId: string) {
  const poll = await Poll.findById(pollId);
  if (!poll) return null;

  const votes = await Vote.find({ pollId });
  const Like = require('../models/Like').default;
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

export const submitVote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pollId } = req.params;
    const { userId, optionId } = req.body;

    if (!userId || !optionId) {
      return res.status(400).json({
        success: false,
        error: 'userId and optionId are required'
      });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({
        success: false,
        error: 'Poll not found'
      });
    }

    const optionExists = poll.options.some(opt => opt.id === optionId);
    if (!optionExists) {
      return res.status(400).json({
        success: false,
        error: 'Invalid option'
      });
    }

    let vote = await Vote.findOne({ pollId, userId });
    const previousVote = vote ? vote.optionId : null;

    if (vote) {
      vote.optionId = optionId;
      await vote.save();
    } else {
      vote = await Vote.create({ pollId, userId, optionId });
    }

    const pollWithStats = await getPollWithStats(pollId);

    const io = req.app.get('io');
    io.emit('vote:updated', {
      pollId,
      userId,
      optionId,
      previousVote,
      poll: pollWithStats
    });

    res.json({
      success: true,
      message: previousVote ? 'Vote updated' : 'Vote submitted',
      poll: pollWithStats
    });
  } catch (error) {
    next(error);
  }
};

export const removeVote = async (req: Request, res: Response, next: NextFunction) => {
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

    await Vote.deleteOne({ pollId, userId });
    const pollWithStats = await getPollWithStats(pollId);

    const io = req.app.get('io');
    io.emit('vote:removed', { pollId, userId, poll: pollWithStats });

    res.json({
      success: true,
      message: 'Vote removed',
      poll: pollWithStats
    });
  } catch (error) {
    next(error);
  }
};

export const getUserVote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pollId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const vote = await Vote.findOne({ pollId, userId: userId as string });

    res.json({
      success: true,
      voted: !!vote,
      optionId: vote ? vote.optionId : null
    });
  } catch (error) {
    next(error);
  }
};