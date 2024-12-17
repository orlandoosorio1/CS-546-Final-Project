import { Router } from 'express';
import { getAllTeams } from '../data/teams.js'; // New function to fetch all teams
const router = Router();

// Render the Team Sharing page with all teams
router.get('/', async (req, res) => {
    try {
        const allTeams = await getAllTeams();
        res.render('teamsharing', { 
            title: "Team Sharing", 
            teams: allTeams 
        });
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).send("An error occurred while loading the Team Sharing page.");
    }
});

export default router;
