# CS-546-Final-Project

## Overview
Application is built to explore Pokemon-related features, including games, trivia, and team building. Uses MongoDB for data storage, Handlebars for templating, and Express.js for routing and middleware.

## app.js
- Serves as entry point for application.
- Configures:
    - Middleware for parsing requests, managing sessions, and enforcing authentication.
    - Static file serving for CSS, images, and other assets.
    - Handlebars as the templating engine for rendering views.
    Application routes to ensure authenticated and unauthenticated access.
- Starts the Express server on http://localhost:3000.

## Routes Folder
Organizes the application into different endpoints:
- auth.js:
    - '/': Welcome page for unauthenticated users.
    - '/login': Log in page and authentication handler.
    - '/signup': Sign-up page for new users.
    - '/logout': Logs out users and ends the session.
- home.js: Displays the main home page for authenticated users.
- profile.js: Shows the user profile page.
- trivia.js: Hosts the trivia game feature.
- pokemon.js: Implements the "Who's That Pokémon?" guessing game.
- encyclopedia.js: Displays the Pokémon encyclopedia with stats and abilities.
- builder.js: Allows users to build and manage Pokémon teams.
- Undefined routes return a 404 Not Found message.

## Views Folder
### Layouts
- main.handlebars:
    - Base layout for authenticated pages.
    - Includes a header (logo, welcome message, logout button) and navigation bar.
    - Injects dynamic page content using {{{body}}}.
- auth.handlebars:
    - Layout for unauthenticated pages (e.g., /, /login, /signup)
    - Displays a simple header and main content area.

### Unauthenticated Views
- login.handlebars: Contains a login form.
- root.handlebars: Welcome page for new users with links to log in or sign up.
- signup.handlebars: Provides a form for creating a new account.

### Authenticated Views
- home.handlebars:
    - Displays the main features of the app, including:
        - Pokémon Encyclopedia.
        - Team Builder.
        - Trivia.
        - "Who's That Pokémon?" game.
- Placeholders: Remaining views (whosthatpokemon, trivia, teambuilder, profile, encyclopedia) have no progress yet.

## Public Folder
- /css:
    - main.css: Styles the layout, header, navigation, and other elements for authenticated pages.
    - home.css: Adds specific styles for the home page, such as the feature cards and introduction.
- /images:
    - pokemon-logo.png: Pokémon logo for the header.
    - pokemon-starters.png: Welcoming image on the home page.

## Data Folder
- index.js:
    - Exports data access functions (currently usersData).
- users.js:
    - Manages the users collection.
    - Functions:
        - createUser: Creates a new user with a hashed password
        - getUserById: Retrieves a user by their ID.
        - findUserByUsername: Searches for a user by username.
- pokemon.js and teams.js:
    - Not implemented yet. Will handle Pokémon and team-related features.

## Config Folder
- mongoCollections.js:
    - Provides access to the users and teams collections.
- mongoConnection.js:
    - Connects to and manages the MongoDB database lifecycle.
- settings.js:
    - Contains the database URL (localhost:27017) and name (PokeApp).

## Getting Started
1. Install dependencies using npm install.
2. Start the server with npm start.
3. Access the application at http://localhost:3000.

