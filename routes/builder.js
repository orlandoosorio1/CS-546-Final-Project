import { Router } from 'express';
const router = Router();

// Render the Team Builder page
router.route('/').get(async (req, res) => {
  res.render('teambuilder', { title: "Team Builder" });
});

export default router;