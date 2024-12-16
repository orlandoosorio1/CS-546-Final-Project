import { Router } from 'express';
import { updateWhosThatPokeScore, pokemonTopPlayers } from '../data/users.js'; // Import the necessary functions
import { dbConnection } from '../config/mongoConnection.js';

const router = Router();

// Render the main Who's That Pokémon page
router.get('/', (req, res) => {
  res.render('whosthatpokemon', { title: "Who's That Pokémon" });
});

// Render the quiz page
router.get('/quiz', (req, res) => {
  try {
    res.render('whosthatpokemonquiz', { 
      title: "Who's That Pokémon Quiz"
    });
  } catch (error) {
    console.error("Error loading the quiz page:", error.message);
    res.status(500).send("An error occurred while loading the quiz page.");
  }
});

// Save the user's score to the database
router.post('/save-score', async (req, res) => {
  const userId = req.session?.user?._id; // Retrieve user ID from session
  if (!userId) {
    console.error('User not logged in');
    return res.status(401).json({ error: 'User not logged in.' });
  }

  const { whosThatPokeScore } = req.body;

  // Step 2: Validate score input
  if (typeof whosThatPokeScore !== 'number' || whosThatPokeScore < 0) {
    console.error('Invalid score:', whosThatPokeScore);
    return res.status(400).json({ error: 'Invalid score. A positive numeric score is required.' });
  }

  try {
    console.log('Updating score in database for user:', userId);
    // Step 3: Update the score in the database
    const updatedUser = await updateWhosThatPokeScore(userId, whosThatPokeScore);

    console.log('Score updated successfully:', updatedUser);
    res.status(200).json({ message: 'Score saved successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score.' });
  }
});


// Fetch the leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    // Fetch the top 20 Pokémon players
    const topPokemonPlayers = await pokemonTopPlayers(20);

    res.status(200).json({ pokemonLeaderboard: topPokemonPlayers });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

export default router; // Default export
