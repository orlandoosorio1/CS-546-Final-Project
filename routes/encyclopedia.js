import { Router } from 'express';
const router = Router();

router.route('/').get(async (req, res) => {
  res.render('encyclopedia', { title: "Encyclopedia" });
});


export default router;