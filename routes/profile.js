import { Router } from 'express';
const router = Router();

// Render the Profile page
router.route('/').get(async (req, res) => {
  res.render('profile', { title: "Profile" });
});

export default router;