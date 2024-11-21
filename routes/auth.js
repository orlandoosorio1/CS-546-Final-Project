import { Router } from 'express';
import { usersData } from '../data/index.js'; // User data functions
import bcrypt from 'bcryptjs'; // Password hashing utility

const router = Router();

// Root Route - Redirect logged-in users to '/home', otherwise render the welcome page
router.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/home');
    }
    res.render('root', { layout: 'auth', title: 'Welcome to Pokémon Hub' });
});

// Login Page - Redirect logged-in users to '/home', otherwise render the login page
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/home');
    }
    res.render('login', { layout: 'auth', title: 'Log In' });
});

// Login Handler - Authenticate user credentials and start a session
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await usersData.findUserByUsername(username); // Fetch user
        const passwordMatch = await bcrypt.compare(password, user.password); // Validate password

        if (!passwordMatch) {
            throw 'Error: Invalid username or password.';
        }

        req.session.user = { username: user.username }; // Set session
        res.redirect('/home'); // Redirect to home on success
    } catch (error) {
        res.status(400).render('login', { 
            layout: 'auth', 
            title: 'Log In', 
            error: error 
        });
    }
});

// Sign-Up Page - Redirect logged-in users to '/home', otherwise render the signup page
router.get('/signup', (req, res) => {
    if (req.session.user) {
        return res.redirect('/home');
    }
    res.render('signup', { layout: 'auth', title: 'Sign Up' });
});

// Sign-Up Handler - Create a new user and start a session
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = await usersData.createUser(username, password); // Create user
        req.session.user = { username: newUser.username }; // Set session
        res.redirect('/home'); // Redirect to home on success
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).render('signup', { 
            layout: 'auth', 
            title: 'Sign Up', 
            error: error 
        });
    }
});

// Logout - Destroy session and redirect to root page
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/'); // Redirect to root page
    });
});

export default router;
