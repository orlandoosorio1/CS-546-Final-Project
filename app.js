import express from 'express';  // Import Express framework
const app = express();  // Initialize Express app
import configRoutes from './routes/index.js';   // Import app routes
import exphbs from 'express-handlebars';    // Import Handlebars for templating

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  // let the next middleware run:
  next();
};

app.use('/public', express.static('public'));   // Serve static files from 'public'
app.use(express.json());    // Parse JSON data
app.use(express.urlencoded({extended: true}));  // Parse URL-encoded data
app.use(rewriteUnsupportedBrowserMethods);  // Enable PUT/DELETE 

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));   // Set Handlebars with main layout
app.set('view engine', 'handlebars');   // Set Handlebars as view engine

configRoutes(app);  // Configure app routes

// Start server on port 3000
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

