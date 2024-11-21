import { Router } from 'express';
const router = Router();

// Render the Home page
router.route('/').get(async (req, res) => {
  res.render('home', { title: "Home" });
});


export default router;