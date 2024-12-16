import { teams } from '../config/mongoCollections.js';
import { addTeamToUser } from './users.js';
import { ObjectId } from 'mongodb';
import * as pokeData from "./pokemon.js";
import validation from '../validation.js';

export const createTeam = async (userId, name, pokemon) => {
    try {
        // Validate and convert userId to ObjectId
        const userObjectId = new ObjectId(validation.checkId(userId));
        // Validate other inputs
        name = validation.checkString(name, "Name");
        pokemon = validation.checkList(pokemon, "Pokemon");
        // Create the team object
        const newTeam = { 
            userId: userObjectId,
            name: name, 
            pokemon: pokemon 
        };
        // Insert the team into the collection
        let teamCollection = await teams();
        const insertInfo = await teamCollection.insertOne(newTeam);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) 
            throw 'Could not add team';
        // Add the team ID to the user
        await addTeamToUser(new ObjectId(userId), insertInfo.insertedId.toString());
        // Return the created team
        return await getTeamById(insertInfo.insertedId.toString());

    } catch (error) {
        console.error("Error in createTeam:", error.message);
        throw error;
    }
};



export const getTeamById = async (id) => {
    id = validation.checkId(id);
    let teamCollection = await teams();
    let team = await teamCollection.findOne({ _id: new ObjectId(id) });
    if (!team) throw 'No team found with that ID';
    team._id = team._id.toString();
    return team;
  };

export const editTeam = async (teamId, userId, name, pokemon) => {
    try{
        // the first step is to validate the inputs
        teamId = validation.checkId(teamId);
        userId = validation.checkId(userId);
        name = validation.checkString(name, "Name");
        pokemon = validation.checkList(pokemon, "Pokemon");
        // the next step is to find the team we want
        let teamCollection = await teams();
        let team = await teamCollection.findOne({_id: new ObjectId(teamId)});
        if(!team) throw 'No team found with that ID';
        // now, update the team
        let updateInfo = await teamCollection.findOneAndUpdate(
            { _id: new ObjectId(teamId)},
            { $set: {userId: userId, name: name, pokemon: pokemon} },
            { returnDocument: 'after' }
          );
        if (!updateInfo) throw 'Error: Update failed';
        updateInfo._id = updateInfo._id.toString();
        return updateInfo;

    }catch(error){
        console.error(error.message);
        throw error;
    };
};

export const deleteTeam = async (teamId) => {
    try{
        // the first step is to validate the teamId
        teamId = validation.checkId(teamId);
        // then find and delete from collection
        let teamCollection = await teams();
        let deletionInfo = await teamCollection.findOneAndDelete({ _id: new ObjectId(teamId)});
        if (!deletionInfo) throw `Could not delete team with id of ${teamId}`;
        return `The ${deletionInfo.name} has been successfully deleted!`;

    }catch(error){
        console.error(error.message);
        throw error;
    };
};


export const getTeamsByUserId = async (userId) => {
    try {
        //CONVERT USER ID INTO OBJECT
        const userObjectId = new ObjectId(userId);
        //fetch collection
        let teamCollection = await teams();
        //fetch all teams from user
        let userTeams = await teamCollection.find({ userId: userId }).toArray();
        //convert _id to string
        userTeams.forEach(team => {
            team._id = team._id.toString();
        });

        return userTeams;
    } catch (error) {
        console.error('Error fetching teams for user:', error.message || error);
        throw error;
    }
};
