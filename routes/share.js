import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('teamsharing', { title: "Team Sharing" });
});

export default router;
