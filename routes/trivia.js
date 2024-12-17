import { Router } from 'express';
const router = Router();
import { usersData, pokemonData, teamData } from '../data/index.js';
import { updateTriviaScore, pokemonTopPlayers } from '../data/users.js'; 
// Render the Trivia page
router.post('/getRandomPokemonByCount', async (req, res) => {
  try {
      let { count } = req.body;
      console.log("Count from body: ", count);
      let output = await pokemonData.getRandomPokemonByCount(count);
      return res.json(output);
  } catch (error) {
      console.error("Error fetching Pokémon:", error);
      res.status(500).json({ error: "An error occurred" });
  }
});
router.get('/', (req, res) => {
  res.render('trivia', { title: "Trivia" });
});
router.get('/quiz', (req, res) => {
  try {
    res.render('triviaquiz', { title: "Trivia Quiz"});
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

  const { triviaScore } = req.body;

  // Step 2: Validate score input
  if (typeof triviaScore !== 'number' || triviaScore < 0) {
    console.error('Invalid score:', triviaScore);
    return res.status(400).json({ error: 'Invalid score. A positive numeric score is required.' });
  }

  try {
    console.log('Updating score in database for user:', userId);
    // Step 3: Update the score in the database
    const updatedUser = await updateTriviaScore(userId, triviaScore);

    console.log('Score updated successfully:', updatedUser);
    res.status(200).json({ message: 'Score saved successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score.' });
  }
});

export default router;
