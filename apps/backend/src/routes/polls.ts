import express from "express";
import Poll from "../models/Poll";

const router = express.Router();

/**
 * GET /api/polls
 * Get all polls
 */
router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/polls
 * Create a new poll
 * Body: { question: string, options: string[] }
 */
router.post("/", async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ message: "Question and at least 2 options required" });
    }

    const poll = new Poll({
      question,
      options: options.map((text: string) => ({ text, votes: 0 })),
    });

    await poll.save();

    // Emit event to all clients
    req.app.get("io")?.emit("pollUpdated", poll);

    res.status(201).json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /api/polls/:id/vote
 * Vote for an option
 * Body: { optionIndex: number }
 */
router.patch("/:id/vote", async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option index" });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    // Emit event to all clients
    req.app.get("io")?.emit("pollUpdated", poll);

    res.json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /api/polls/:id/like
 * Like a poll
 */
router.patch("/:id/like", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    poll.likes += 1;
    await poll.save();

    // Emit event to all clients
    req.app.get("io")?.emit("pollUpdated", poll);

    res.json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
