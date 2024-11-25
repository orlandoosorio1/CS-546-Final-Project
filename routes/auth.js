import { Router } from 'express';
import { usersData } from '../data/index.js'; // User data functions
import help from '../validation.js';
import bcrypt from 'bcryptjs'; // Password hashing utility

const router = Router();

// Root Route - Render combined login and signup page
router.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/home'); // Redirect logged-in users to home
    }
    res.render('auth', { layout: 'auth', title: 'Authentication' });
});

// Login Handler - Authenticate user credentials and start a session
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Ensure both fields are provided and valid
    try {
        help.checkString(username, 'Username');
        help.checkString(password, 'Password');
    } catch (e) {
        res.status(400).render('auth', {
            layout: 'auth',
            title: 'Log In',
            error: e,
        });
    }
    try {
        const user = await usersData.findUserByUsername(username); // Fetch user
        const passwordMatch = await bcrypt.compare(password, user.password); // Validate password

        if (!passwordMatch) {
            throw 'Error: Invalid username or password.';
        }

        req.session.user = { username: user.username }; // Set session
        res.redirect('/home'); // Redirect to home on success
    } catch (error) {
        console.error('Login error:', error);
    }
});

// Sign-Up Handler - Create a new user and start a session
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    // Ensure all fields are provided and valid
    try {
        help.checkString(username, 'Username');
        help.checkString(password, 'Password');
    } catch (e) {
        res.status(400).render('auth', {
            layout: 'auth',
            title: 'Sign Up',
            error: e,
        });
    }
    // Set favPokemon to "Unknown" by default
    const favPokemon = 'Unknown';
    try {
        const newUser = await usersData.createUser(username, password, favPokemon); // Create user
        req.session.user = { username: newUser.username }; // Set session
        res.redirect('/home'); // Redirect to home on success
    } catch (error) {
        console.error('Signup error:', error);
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
