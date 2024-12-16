//TEAMBUILDER.JS
import { Router } from 'express';
import validation from '../validation.js';
import { usersData } from '../data/index.js';
import { updateUserTeams , getUserById} from '../data/users.js';


const router = Router();
const teamsMap = {}; 

//render teambuilder page
router.get('/', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/'); //if you arent a user redirect to login
    }
    res.render('teambuilder', {
        title: 'Team Builder',
    });
});

//SAVE-TEAM POST ROUTE
router.post('/save-team', async (req, res) => {
    const userId = req.session?.user?._id;

    try {
        //check if user is logged into account
        if (!userId) {
            console.error('User not logged in');
            return res.status(401).json({ error: 'User not logged in.' });
        }
        const { team } = req.body;

        //validation
        validation.checkList(team, 'Team');
        if (team.length < 1 || team.length > 6) {
            return res.status(400).json({ error: 'Team must contain 1-6 Pokémon.' });
        }
        //fetch user from db
        const user = await usersData.getUserById(userId);
        if (!user) {
            console.error(`No user found for ID: ${userId}`);
            return res.status(404).json({ error: 'User not found.' });
        }
        //if the user teams array is not initialized, then initialize it
        if (!user.teams) {
            user.teams = [];
        }
        //error handling for teams set(max = 3)
        if (user.teams.length >= 3) {
            return res.status(400).json({ error: 'You can only save up to 3 teams.' });
        }
        
        const teamName = `Team ${user.teams.length + 1}`;
        const newTeam = { name: teamName, pokemon: team };

        user.teams.push(newTeam); 
        //push team into newTeam array
        await usersData.updateUserTeams(userId, user.teams);
        //log into mongo db

        res.status(200).json({ message: 'Team saved successfully!', team: newTeam });
    } catch (error) {
        console.error('Error saving team:', error.message || error);
        res.status(500).json({ error: 'Failed to save the team.' });
    }
});

//route to update team
router.post('/update-team', (req, res) => {
    const { userId, teamIndex, updatedTeam } = req.body;
    
    try {
        //validation
        if (!userId) return res.status(400).json({ error: 'User ID is required.' });
        if (!Number.isInteger(teamIndex) || teamIndex < 0 || teamIndex > 2) {
            return res.status(400).json({ error: 'Invalid team index.' });
        }
        validation.checkList(updatedTeam, 'Team');
        //check first before user has existing team
        if (!teamsMap[userId] || !teamsMap[userId][teamIndex]) {
            return res.status(400).json({ error: 'Team does not exist.'});
        }
        //updating the team
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
