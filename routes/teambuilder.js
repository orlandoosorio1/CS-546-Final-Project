//TEAMBUILDER.JS
import { Router } from 'express';
import validation from '../validation.js';
import { usersData } from '../data/index.js';
import { updateUserTeams , getUserById} from '../data/users.js';


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
    const userId = req.session?.user?._id;

    try {
        // Check if user is logged in
        if (!userId) {
            console.error('User not logged in');
            return res.status(401).json({ error: 'User not logged in.' });
        }

        const { team } = req.body;

        // Validate the team
        validation.checkList(team, 'Team');
        if (team.length < 1 || team.length > 6) {
            return res.status(400).json({ error: 'Team must contain 1-6 Pokémon.' });
        }

        // Fetch the user from the database
        const user = await usersData.getUserById(userId);
        if (!user) {
            console.error(`No user found for ID: ${userId}`);
            return res.status(404).json({ error: 'User not found.' });
        }

        // Initialize teams array if not present
        if (!user.teams) user.teams = [];

        // Check if the user already has 3 teams
        if (user.teams.length >= 3) {
            return res.status(400).json({ error: 'You can only save up to 3 teams.' });
        }

        // Create and append the new team
        const teamName = `Team ${user.teams.length + 1}`;
        const newTeam = { name: teamName, pokemon: team };

        user.teams.push(newTeam); // Add the team to the teams array

        // Update the user's document in MongoDB
        await usersData.updateUserTeams(userId, user.teams);

        res.status(200).json({ message: 'Team saved successfully!', team: newTeam });
    } catch (error) {
        console.error('Error saving team:', error.message || error);
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
        res.status(500).json({ error: 'Failed to update the team.' });
    }
});

export default router;
