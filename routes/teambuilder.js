//TEAMBUILDER.JS
import { Router } from 'express';
import validation from '../validation.js';
import { usersData } from '../data/index.js';
import { updateUserTeams , getUserById} from '../data/users.js';
import { teams } from '../config/mongoCollections.js';

const router = Router();

// Local storage for user teams
const teamsMap = {}; // Key: userId, Value: Array of teams

// Render team builder page
router.get('/', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/'); // Redirect unauthenticated users to login
    }

    res.render('teambuilder', {
        title: 'Team Builder',
    });
});

// Route to save a team
router.post('/save-team', async (req, res) => {
    const { userId, teamName, team } = req.body;

    try {
        if (!userId || !teamName || !team) {
            return res.status(400).json({ error: 'Missing user ID, team name, or team data.' });
        }

        // Fetch user data
        const user = await usersData.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Error handling for max teams (3)
        if (!user.teams) user.teams = [];
        if (user.teams.length >= 3) {
            return res.status(400).json({ error: 'You can only save up to 3 teams.' });
        }

        // Define new team
        const newTeam = {
            name: teamName,
            pokemon: team,
            userId: userId, // Attach user ID for Team Sharing page
        };

        // Save team to 'teams' collection
        const teamCollection = await teams();
        const insertResult = await teamCollection.insertOne(newTeam);
        if (!insertResult.acknowledged) {
            throw new Error('Failed to insert team into the database.');
        }

        // Add the team to the user's document
        user.teams.push({ name: teamName, pokemon: team });
        await usersData.updateUserTeams(userId, user.teams);

        res.status(200).json({ message: 'Team saved successfully!', team: newTeam });
    } catch (error) {
        console.error('Error saving team:', error.message);
        res.status(500).json({ error: 'Failed to save the team.' });
    }
});

// Route to update a team
router.post('/update-team', (req, res) => {
    const { userId, teamIndex, updatedTeam } = req.body;

    try {
        // Validate inputs
        if (!userId) return res.status(400).json({ error: 'User ID is required.' });
        if (!Number.isInteger(teamIndex) || teamIndex < 0 || teamIndex > 2) {
            return res.status(400).json({ error: 'Invalid team index.' });
        }
        validation.checkList(updatedTeam, 'Team');

        // Check if user has teams
        if (!teamsMap[userId] || !teamsMap[userId][teamIndex]) {
            return res.status(400).json({ error: 'Team does not exist.' });
        }

        // Update the team
        teamsMap[userId][teamIndex] = {
            name: `Team ${teamIndex + 1}`,
            pokemon: updatedTeam,
        };

        res.status(200).json({ message: 'Team updated successfully!', team: teamsMap[userId][teamIndex] });
    } catch (error) {
        console.error('Error updating team:', error.message || error);
        res.status(404).json({ error: 'Failed to update the team.' });
    }
});

export default router;
