import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Poll from '../models/Poll';
import Vote from '../models/Vote';
import Like from '../models/Like';

// Helper function to get poll with statistics
async function getPollWithStats(pollId: string) {
  const poll = await Poll.findById(pollId);
  if (!poll) return null;

  const votes = await Vote.find({ pollId });
  const likes = await Like.countDocuments({ pollId });

  // Calculate vote counts per option
  const voteCounts: Record<string, number> = {};
  poll.options.forEach(opt => {
    voteCounts[opt.id] = 0;
  });

  votes.forEach(vote => {
    if (voteCounts[vote.optionId] !== undefined) {
      voteCounts[vote.optionId]++;
    }
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
      percentage: totalVotes > 0 
        ? parseFloat(((voteCounts[opt.id] / totalVotes) * 100).toFixed(1))
        : 0
    }))
  };
}

export const getAllPolls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const polls = await Poll.find({ isActive: true }).sort({ createdAt: -1 });
    
    const pollsWithStats = await Promise.all(
      polls.map(poll => getPollWithStats(poll._id.toString()))
    );

    res.json({
      success: true,
      count: polls.length,
      polls: pollsWithStats
    });
  } catch (error) {
    next(error);
  }
};

export const getPollById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pollId } = req.params;
    const pollWithStats = await getPollWithStats(pollId);

    if (!pollWithStats) {
      return res.status(404).json({
        success: false,
        error: 'Poll not found'
      });
    }

    res.json({
      success: true,
      poll: pollWithStats
    });
  } catch (error) {
    next(error);
  }
};

export const createPoll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, options, createdBy } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Question and at least 2 options are required'
      });
    }

    if (options.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 options allowed'
      });
    }

    const pollOptions = options.map((text: string, index: number) => ({
      id: uuidv4(),
      text,
      order: index
    }));

    const poll = await Poll.create({
      question,
      options: pollOptions,
      createdBy: createdBy || 'Anonymous'
    });

    const pollWithStats = await getPollWithStats(poll._id.toString());

    // Emit to all connected clients
    const io = req.app.get('io');
    io.emit('poll:created', pollWithStats);

    res.status(201).json({
      success: true,
      poll: pollWithStats
    });
  } catch (error) {
    next(error);
  }
};

export const deletePoll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pollId } = req.params;
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({
        success: false,
        error: 'Poll not found'
      });
    }

    // Soft delete
    poll.isActive = false;
    await poll.save();

    // Emit to all connected clients
    const io = req.app.get('io');
    io.emit('poll:deleted', { pollId });

    res.json({
      success: true,
      message: 'Poll deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
