import {users} from '../config/mongoCollections.js';
import help from '../validation.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcryptjs';

const saltRounds = 10;

// Function to create a new user
export const createUser = async (username, password, favPokemon) => {
  // Verify parameters
  username = help.checkString(username, 'username');
  password = help.checkString(password, 'password');
  favPokemon = help.checkString(favPokemon, 'favPokemon');
  const userCollection = await users();
  // Check if the username already exists
  const existingUser = await userCollection.findOne({ username: username.toLowerCase() });
  if (existingUser) {
    throw "Error: User with this username already exists.";
  }
  // Hash the user's password
  const hash = await bcrypt.hash(password, saltRounds);
  // Create the new user object
  const newUser = {
      username: username.toLowerCase(),
      password: hash,
      teams: [], // Initialize with an empty array
      triviaScore: 0, // Default score
      whosThatPokeScore: 0, // Default score
      favPokemon: favPokemon || "Unknown", // Default to "Unknown" if not provided
  };

  // Insert the new user into the collection
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Error: Could not add user.";
  }
  // Return the newly created user
  const newId = insertInfo.insertedId.toString();
  return await getUserById(newId);
};

// Function to get a user by their unique ID
export const getUserById = async (id) => {
  id = help.checkId(id);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!user) {
    throw `Error: No user with id ${id}.`;
  }
  user._id = user._id.toString();
  return user;
};

// Function to find a user by their unique username
export const findUserByUsername = async (username) => {
  username = help.checkString(username, 'username');
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username.toLowerCase() });
  if (!user) {
      throw `Error: No user found with username '${username}'.`;
  }
  user._id = user._id.toString();
  return user;
};

// Function to update a user's trivia score
export const updateTriviaScore = async (id, newScore) => {
  id = help.checkId(id);
  newScore = help.checkNumber(newScore, 'newScore');
  const userCollection = await users();
  const updateInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $max: { triviaScore: newScore } }, // Update only if the new score is higher
    { returnDocument: 'after' }
  );
  if (!updateInfo.value) {
    throw `Error: Could not update trivia score for user with ID '${id}'.`;
  }
  return await getUserById(id);
};

// Function to update a user's "Who's That Pokémon" score
export const updateWhosThatPokeScore = async (id, newScore) => {
  id = help.checkId(id);
  newScore = help.checkNumber(newScore, 'newScore');
  const userCollection = await users();
  const updateInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $max: { whosThatPokeScore: newScore } }, // Update only if the new score is higher
    { returnDocument: 'after' }
  );
  if (!updateInfo.value) {
    throw `Error: Could not update "Who's That Pokémon" score for user with ID '${id}'.`;
  }
  return await getUserById(id);
};

// Function to add a team ID to a user's saved teams
export const addTeamToUser = async (id, teamId) => {
  id = help.checkId(id);
  teamId = help.checkId(teamId);
  const userCollection = await users();
  const updateInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $addToSet: { teams: teamId } }, // Add the team ID only if it doesn't already exist
    { returnDocument: 'after' }
  );
  if (!updateInfo.value) {
    throw `Error: Could not add team to user with ID '${id}'.`;
  }
  return await getUserById(id);
};

