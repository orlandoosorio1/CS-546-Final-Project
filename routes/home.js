import { Router } from 'express';
import { usersData } from '../data/index.js'; // User data functions
const router = Router();

// Render the Home page
router.route('/').get(async (req, res) => {
  try {
    const topTriviaPlayers = await usersData.triviaTopPlayers();
    const topPokemonPlayers = await usersData.pokemonTopPlayers();
    res.render('home', {
      layout: 'main',
      title: 'Home',
      triviaLeaderboard: topTriviaPlayers,
      pokemonLeaderboard: topPokemonPlayers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


export default router;