import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import configRoutes from './routes/index.js';
import populateDatabase from './data/populateDatabase.js';

// delete these imports
import * as pokeFunc from "./data/pokemon.js";

const app = express();

// Middleware to allow PUT/DELETE requests via _method in forms
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

// Serve static files (e.g., CSS, JS, images) from the "public" directory
app.use('/public', express.static('public'));

// Configure session for user authentication
app.use(
  session({
    name: 'AuthCookie',
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Session cookie lasts 1 day
  })
);

// Make session user data available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // `user` is accessible in Handlebars
  next();
});

// Redirect unauthenticated users to the login page
app.use((req, res, next) => {
  const publicRoutes = ['/', '/login', '/signup'];
  if (!publicRoutes.includes(req.path) && !req.session.user) {
    return res.redirect('/'); // Block access to private routes
  }
  next();
});

// Parse JSON and URL-encoded data in request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods); // Enable custom method overrides

// Set up Handlebars view engine with a default layout
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Initialize application routes
configRoutes(app);
populateDatabase();
let ans = await pokeFunc.getPokemonByType("grass");
console.log(JSON.stringify(ans), null, 2);
// Start the server
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

