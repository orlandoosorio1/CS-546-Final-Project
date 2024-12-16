import { Router } from 'express';

// Render the main Who's That Pokémon page
const router = Router();


router.get('/', (req, res) => {
  res.render('whosthatpokemon', { title: "Who's That Pokémon" });
});

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

export default router;
