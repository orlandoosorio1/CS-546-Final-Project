import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.render('login', { layout: 'login', title: 'Login' }); // Use the 'login' layout
});

export default router;