//FETCHING DATA
import {Router} from 'express';
import pokemonData from '../data/pokemon.json'; 
import {users} from '../data/users.js'; 

const router = Router();

router.get('/pokemon', async (req, res) => {
    //returns a list of all the pokemon that the user can choose
    res.json(pokemonData);
});
router.post('/save-team', async (req, res) => {
    const {userId, team} = req.body;
    if (!team || team.length > 6) {
        //error handing if team exceeds 6 pokemon or if team doesnt exist
        return res.status(400).json({ error: 'Team must contain 1-6 Pokémon.' });
    }
    const user = await users.getUserById(userId);
    if (user.teams.length >= 3) {
        //error handling for # of teams set
        return res.status(400).json({ error: 'You can only save up to 3 teams.' });
    }
    user.teams.push(team);
    res.json({ message: 'Team saved successfully!', teams: user.teams });
});

export default router;
