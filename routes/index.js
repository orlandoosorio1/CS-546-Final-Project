import authRoutes from './auth.js';
import homeRoutes from './home.js';
import profileRoutes from './profile.js';
import triviaRoutes from './trivia.js';
import pokemonRoutes from './pokemon.js';
import encyclopediaRoutes from './encyclopedia.js';
import builderRoutes from './builder.js';
import rankerRoutes from './ranker.js';
import shareRoutes from './share.js';

const constructorMethod = (app) => {
    app.use('/', authRoutes);
    app.use('/home', homeRoutes);
    app.use('/profile', profileRoutes);
    app.use('/trivia', triviaRoutes);
    app.use('/pokemon', pokemonRoutes);
    app.use('/encyclopedia', encyclopediaRoutes);
    app.use('/builder', builderRoutes);
    app.use('/ranker', rankerRoutes);
    app.use('/share', shareRoutes); 

    app.use('*', (req, res) => {
        res.status(404).send('<h1>404 Not Found</h1>');
    });
};

export default constructorMethod;
