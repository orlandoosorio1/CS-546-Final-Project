import { Router } from 'express';
const router = Router();

router.route('/').get(async (req, res) => {
  res.render('trivia', { title: "Trivia" });
});


export default router;