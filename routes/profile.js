import { Router } from 'express';
const router = Router();

router.route('/').get(async (req, res) => {
  res.render('profile', { title: "Profile" });
});

export default router;