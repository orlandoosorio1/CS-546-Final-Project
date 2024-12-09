import authRoutes from './auth.js'; // Routes for authentication ('/', '/login', '/signup', '/logout')
import homeRoutes from './home.js'; // Routes for home page functionality
import profileRoutes from './profile.js'; // Routes for user profile functionality
import triviaRoutes from './trivia.js'; // Routes for trivia game feature
import pokemonRoutes from './pokemon.js'; // Routes for "Who's That Pokémon" feature
import encyclopediaRoutes from './encyclopedia.js'; // Routes for Pokémon encyclopedia
import builderRoutes from './builder.js'; // Routes for Pokémon team builder

const constructorMethod = (app) => {
    app.use('/', authRoutes);
    app.use('/home', homeRoutes);
    app.use('/profile', profileRoutes);
    app.use('/trivia', triviaRoutes);
    app.use('/pokemon', pokemonRoutes);
    app.use('/encyclopedia', encyclopediaRoutes);
    app.use('/builder', builderRoutes);

    app.use('*', (req, res) => {
        res.status(404).send('<h1>404 Not Found</h1>'); // Catch-all route for undefined paths
    });
};

export default constructorMethod;
