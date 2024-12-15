import { teams } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as pokeData from "./pokemon.js";
import validation from '../validation.js';

export const createTeam = async (userId, name, pokemon) => {
    try{
        // the first step is to validate all inputs
        userId = validation.checkId(userId);
        name = validation.checkString(name, "Name");
        pokemon = validation.checkList(pokemon, "Pokemon");
        // now that the inputs are validated, we have to create a new object and put it inside mongo
        let newTeam = {userId: userId, name: name, pokemon: pokemon};
        // now, add the team to mongo collection
        let teamCollection = await teams();
        const insertInfo = await teamCollection.insertOne(newTeam);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add team';
        // return inserted team
        return await getTeamById(insertInfo.insertedId.toString());
    }catch(error){
        console.error(error.message);
    };
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
            { _id: new ObjectId(id) },
            { $set: {userId: userId, name: name, pokemon: pokemon} },
            { returnDocument: 'after' }
          );
        if (!updateInfo) throw 'Error: Update failed';
        updateInfo._id = updateInfo._id.toString();
        return updateInfo;

    }catch(error){
        console.error(error.message);
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
    };
};


export const getTeamsByUserId = async (userId) => {
    try{
        // first validate the userId
        userId = validation.checkId(userId);
        // then, get the collection
        let teamCollection = await teams();
        // find all teams from the database with the userId
        let userTeams = await teamCollection.find({userId: userId}).toArray();
        // then, check 
        if(!userTeams || userTeams.length === 0) throw `No teams found for userId: ${userId}`;
        // convert id fields to strings
        userTeams.forEach(team => {
            team._id = team._id.toString();
        });
        return userTeams;

    }catch(error){
        console.error(error.message);
    };
};



