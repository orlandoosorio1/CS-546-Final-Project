import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.render('teamranker', { title: "Team Ranker" });
});

export default router;
