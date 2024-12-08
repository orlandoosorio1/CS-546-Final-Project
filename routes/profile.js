import { Router } from 'express';
import { usersData } from '../data/index.js'; // Importing usersData from index.js
const router = Router();

// Render the Profile page
router.get('/', async (req, res) => {
    try {
        // Check if the user is logged in
        if (!req.session.user) {
            return res.redirect('/'); // Redirect to login page if not logged in
        }

        // Fetch the user's data using the username stored in the session
        const user = await usersData.findUserByUsername(req.session.user.username);
        if (!user) {
            throw new Error('User not found.');
        }

        // Render the profile page with the user's data
        res.render('profile', { 
            title: "Profile", 
            user: user 
        });
    } catch (err) {
        console.error('Error rendering profile:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Render the Edit Profile page
router.get('/edit', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/'); // Redirect to login page if not logged in
        }

        // Fetch the user's current profile data
        const user = await usersData.findUserByUsername(req.session.user.username);
        if (!user) {
            throw new Error('User not found.');
        }

        res.render('profile-edit', { 
            title: "Edit Profile", 
            user: user 
        });
    } catch (err) {
        console.error('Error rendering edit profile page:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Handle Profile Updates
router.post('/edit', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/'); // Redirect to login page if not logged in
        }

        const { dob, age, favPokemon } = req.body;

        // Update the user's profile
        const updatedUser = await usersData.updateUserProfile(req.session.user.username, {
            dob,
            age: parseInt(age),
            favPokemon
        });

        if (!updatedUser) {
            throw new Error('Failed to update profile.');
        }

        res.redirect('/profile'); // Redirect to the profile page after successful update
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(400).render('profile-edit', {
            title: "Edit Profile",
            error: err.message
        });
    }
});

export default router;
