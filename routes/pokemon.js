import { Router } from 'express';
const router = Router();

// Render the Who's That Pokémon page
router.route('/').get(async (req, res) => {
  res.render('whosthatpokemon', { title: "Who's That Pokémon" });
});

export default router;