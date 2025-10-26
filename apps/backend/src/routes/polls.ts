import express from "express";
import Poll from "../models/Poll";
import Vote from "../models/Vote";
import Like from "../models/Like";

const router = express.Router();

/**
 * Helper function to get poll with statistics
 */
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

/**
 * GET /api/polls
 * Get all polls with statistics
 */
router.get("/", async (req, res) => {
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
    console.error("Error fetching polls:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

/**
 * GET /api/polls/:id
 * Get a single poll with statistics
 */
router.get("/:id", async (req, res) => {
  try {
    const pollWithStats = await getPollWithStats(req.params.id);
    
    if (!pollWithStats) {
      return res.status(404).json({ 
        success: false,
        message: "Poll not found" 
      });
    }

    res.json({
      success: true,
      poll: pollWithStats
    });
  } catch (error) {
    console.error("Error fetching poll:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

/**
 * POST /api/polls
 * Create a new poll
 * Body: { question: string, options: string[], createdBy?: string }
 */
router.post("/", async (req, res) => {
  try {
    const { question, options, createdBy } = req.body;
    
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        success: false,
        message: "Question and at least 2 options are required" 
      });
    }

    if (options.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Maximum 10 options allowed"
      });
    }

    // Import uuid at the top if not already imported
    const { v4: uuidv4 } = require('uuid');
    
    const poll = new Poll({
      question,
      options: options.map((text: string, index: number) => ({
        id: uuidv4(),
        text,
        order: index
      })),
      createdBy: createdBy || "Anonymous"
    });

    await poll.save();

    const pollWithStats = await getPollWithStats(poll._id.toString());

    // Emit event to all clients
    req.app.get("io")?.emit("poll:created", pollWithStats);

    res.status(201).json({
      success: true,
      poll: pollWithStats
    });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

/**
 * POST /api/polls/:id/vote
 * Vote for an option
 * Body: { userId: string, optionId: string }
 */
router.post("/:id/vote", async (req, res) => {
  try {
    const { userId, optionId } = req.body;
    const pollId = req.params.id;

    if (!userId || !optionId) {
      return res.status(400).json({
        success: false,
        message: "userId and optionId are required"
      });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ 
        success: false,
        message: "Poll not found" 
      });
    }

    // Check if option exists
    const optionExists = poll.options.some(opt => opt.id === optionId);
    if (!optionExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid option"
      });
    }

    // Find existing vote
    let vote = await Vote.findOne({ pollId, userId });
    const previousVote = vote ? vote.optionId : null;

    if (vote) {
      // Update existing vote
      vote.optionId = optionId;
      await vote.save();
    } else {
      // Create new vote
      vote = await Vote.create({ pollId, userId, optionId });
    }

    const pollWithStats = await getPollWithStats(pollId);

    // Emit event to all clients
    req.app.get("io")?.emit("vote:updated", {
      pollId,
      userId,
      optionId,
      previousVote,
      poll: pollWithStats
    });

    res.json({
      success: true,
      message: previousVote ? "Vote updated" : "Vote submitted",
      poll: pollWithStats
    });
  } catch (error) {
    console.error("Error voting:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

/**
 * DELETE /api/polls/:id/vote
 * Remove a vote
 * Body: { userId: string }
 */
router.delete("/:id/vote", async (req, res) => {
  try {
    const { userId } = req.body;
    const pollId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ 
        success: false,
        message: "Poll not found" 
      });
    }

    await Vote.deleteOne({ pollId, userId });
    const pollWithStats = await getPollWithStats(pollId);

    // Emit event to all clients
    req.app.get("io")?.emit("vote:removed", {
      pollId,
      userId,
      poll: pollWithStats
    });

    res.json({
      success: true,
      message: "Vote removed",
      poll: pollWithStats
    });
  } catch (error) {
    console.error("Error removing vote:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

/**
 * GET /api/polls/:id/vote/user
 * Get user's vote for a poll
 * Query: ?userId=string
 */
router.get("/:id/vote/user", async (req, res) => {
  try {
    const { userId } = req.query;
    const pollId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const vote = await Vote.findOne({ pollId, userId: userId as string });

    res.json({
      success: true,
      voted: !!vote,
      optionId: vote ? vote.optionId : null
    });
  } catch (error) {
    console.error("Error getting user vote:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

/**
 * POST /api/polls/:id/like
 * Toggle like on a poll
 * Body: { userId: string }
 */
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const pollId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ 
        success: false,
        message: "Poll not found" 
      });
    }

    const existingLike = await Like.findOne({ pollId, userId });
    let liked = false;

    if (existingLike) {
      // Remove like
      await existingLike.deleteOne();
      liked = false;
    } else {
      // Add like
      await Like.create({ pollId, userId });
      liked = true;
    }

    const pollWithStats = await getPollWithStats(pollId);

    // Emit event to all clients
    req.app.get("io")?.emit("like:updated", {
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
    console.error("Error toggling like:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

/**
 * GET /api/polls/:id/like/user
 * Check if user liked a poll
 * Query: ?userId=string
 */
router.get("/:id/like/user", async (req, res) => {
  try {
    const { userId } = req.query;
    const pollId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const like = await Like.findOne({ pollId, userId: userId as string });

    res.json({
      success: true,
      liked: !!like
    });
  } catch (error) {
    console.error("Error checking user like:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

/**
 * DELETE /api/polls/:id
 * Delete a poll (soft delete)
 */
router.delete("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ 
        success: false,
        message: "Poll not found" 
      });
    }

    // Soft delete
    poll.isActive = false;
    await poll.save();

    // Emit event to all clients
    req.app.get("io")?.emit("poll:deleted", { pollId: req.params.id });

    res.json({
      success: true,
      message: "Poll deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting poll:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

export default router;