import homeRoutes from './home.js';
import profileRoutes from './profile.js';
import triviaRoutes from './trivia.js';
import pokemonRoutes from './pokemon.js';
import encyclopediaRoutes from './encyclopedia.js';
import builderRoutes from './builder.js';
import loginRoutes from './login.js';

const constructorMethod = (app) => {
    app.use('/', loginRoutes);
    app.use('/home', homeRoutes);
    app.use('/profile', profileRoutes);
    app.use('/trivia', triviaRoutes);
    app.use('/pokemon', pokemonRoutes);
    app.use('/encyclopedia', encyclopediaRoutes);
    app.use('/builder', builderRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Route Not found' });
    });
};

export default constructorMethod;