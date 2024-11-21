import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcryptjs';

const saltRounds = 10;


export const createUser = async (username, password) => {
    const userCollection = await users();
    const existingUser = await userCollection.findOne({ username });
  
    if (existingUser){
        throw  "User already exists."
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = { 
        username: username.toLowerCase(), 
        password: hash 
      };


    const insertInfo = await userCollection.insertOne(newUser);
    if(!insertInfo.acknowledged || !insertInfo.insertedId){
        throw "Error: Could not add user."
    }

    const newId = insertInfo.insertedId.toString();
    return await getUserById(newId);
};

export const getUserById = async (id) => {
    if (!ObjectId.isValid(id)) {
      throw 'Error: Invalid user ID.';
    }
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw `Error: No user found with ID '${id}'.`;
    }
    user._id = user._id.toString();
    return user;
  };


export const findUserByUsername = async (username) => {
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username.toLowerCase() });
    if (!user) {
        throw `Error: No user found with username '${username}'.`;
    }
    user._id = user._id.toString();
    return user;
};

