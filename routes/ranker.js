import { Router } from 'express';
import { getAllTeamsRanked, upvoteTeam } from '../data/teams.js';

const router = Router();

// Render the Team Ranker page
router.get('/', async (req, res) => {
    try {
        const rankedTeams = await getAllTeamsRanked();
        res.render('teamranker', {
            title: "Team Ranker",
            teams: rankedTeams,
        });
    } catch (error) {
        console.error("Error fetching ranked teams:", error.message);
        res.status(500).send("An error occurred while loading the Team Ranker page.");
    }
});

// Handle upvote requests
router.post('/upvote', async (req, res) => {
    const { teamId } = req.body;

    try {
        const updatedTeam = await upvoteTeam(teamId);
        res.json({ success: true, upvotes: updatedTeam.upvotes });
    } catch (error) {
        console.error("Error upvoting team:", error.message);
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;
