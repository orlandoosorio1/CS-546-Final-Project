import { Router } from 'express';
const router = Router();
import { usersData, pokemonData, teamData } from '../data/index.js';
// Render the Trivia page
router.post('/getRandomPokemonByCount'), async (req, res) => {
  try{
      let {count} = req.body;
      console.log("Count from body: ", count);
      let output = await pokemonData.getRandomPokemonByCount(count);
      return res.json(output);
  }
  catch(error){
    res.status(500).json({ error: "An error occurred" });
  }
}
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

export default router;