//FETCHING DATA
import {Router} from 'express';
import { usersData, pokemonData, teamData } from '../data/index.js';


const router = Router();

router.get('/pokemon', async (req, res) => {
    //returns a list of all the pokemon that the user can choose
    //res.json(pokemonData);
    try{
        let allPokemon = await pokemonData.getAllPokemon();
        return res.json(allPokemon);
    }catch(error){
        console.error("Error fetching Pokémon:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});
router.post('/save-team', async (req, res) => {
    try{
        const {userId, team} = req.body;
        if (!team || team.length > 6) {
            //error handing if team exceeds 6 pokemon or if team doesnt exist
            return res.status(400).json({ error: 'Team must contain 1-6 Pokémon.' });
        }
        const user = await usersData.getUserById(userId);
        if (user.teams.length >= 3) {
            //error handling for # of teams set
            return res.status(400).json({ error: 'You can only save up to 3 teams.' });
        }
        // now push team to teams
        let insertedTeam = await teamData.createTeam(userId, team.name, team.pokemon);
        // now push team to user
        //user.teams.push(team);
        //let updateInfo = await usersData.addTeamToUser(userId, )
        res.json({ message: 'Team saved successfully!', teams: insertedTeam });
    }catch(error){
        console.error("Error creating team:", error);
        res.status(500).json({ error: "An error occurred" })
    }
   
});

export default router;
