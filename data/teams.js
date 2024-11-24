import { teams } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as pokeData from "./pokemon.js";
import validation from './validation.js';

export const createTeam = async (userId, name, pokemon) => {
    try{
        // the first step is to validate all inputs
        let userId = validation.checkId(userId);
        let name = validation.checkString(name, "Name");
        let pokemon = validation.checkList(pokemon, "Pokemon");
        // now that the inputs are validated, we have to create a new object and put it inside mongo
        let newTeam = {userId: userId, name: name, pokemon: pokemon};
        // now, add the team to mongo collection
        let teams = await teams();
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
    const teamCollection = await teams();
    const team = await teamCollection.findOne({ _id: new ObjectId(id) });
    if (!team) throw 'No team found with that ID';
    team._id = team._id.toString();
    return team;
  };

export const editTeam = async () => {
    try{
        

    }catch(error){
        console.error(error.message);
    };
};

export const deleteTeam = async () => {
    try{
        

    }catch(error){
        console.error(error.message);
    };
};


export const getTeamsByUserId = async () => {
    try{
        

    }catch(error){
        console.error(error.message);
    };
};



