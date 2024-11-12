import { Router } from 'express';
const router = Router();

router.route('/').get(async (req, res) => {
  res.render('whosthatpokemon', { title: "Who’s That Pokémon" });
});

export default router;