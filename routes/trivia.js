import { Router } from 'express';
const router = Router();

// Render the Trivia page
router.route('/').get(async (req, res) => {
  res.render('trivia', { title: "Trivia" });
});

export default router;