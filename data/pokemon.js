import {pokemon} from "../config/mongoCollections.js"
import {ObjectId} from "mongodb";
import validation from "../validation.js"


export const getPokemonByName = async (name) => {
    // first step - validate the name to ensure type and length of string
    try{
        name = validation.checkString(name, "Name").toLowerCase();
        // now, query the database and return the pokemon
        let pokemonCollection = await pokemon();
        let queriedPokemon = pokemonCollection.findOne({name: name})
        if(queriedPokemon){
            return queriedPokemon;
        }
        else{
            console.log("No Pokemon found");
        }
    }catch(error){
        console.error(error.message);
        throw error;
    }
}

export const getAllPokemon = async () => {
    try{
        let pokemonCollection = await pokemon();
        let allPokemon = pokemonCollection.find({}).toArray();
        if(allPokemon && allPokemon.length > 0){
            return allPokemon;
        }
        else{
            return [];
        }
    }catch(error){
        console.error(error.message);
        throw error;
    }
}

export const getPokemonByType = async (type) => {
    try{
        type = validation.checkString(type, "Type").toLowerCase();
        // now query the database and return the pokemon
        let pokemonCollection = await pokemon();
        let queriedPokemon = await pokemonCollection.find({"types.type.name": type}).toArray();
        if(queriedPokemon){
            return queriedPokemon;
        }
        else{
            console.log("No Pokemon found");
        }
    }catch(error){
        console.error(error.message);
        throw error;
    }
}

export const getRandomPokemonByCount = async (count) => {
    try{
        count = validation.checkNumber(count, "Count");
        // now query database and return that many pokemon as in count after randomizing them
        let pokemonCollection = await pokemon();
        let queriedPokemon = await pokemonCollection.aggregate([
            {$sample: {size: count}}
        ]).toArray();
        // now, check if the database returned values
        if (queriedPokemon && queriedPokemon.length > 0){
            return queriedPokemon;
        }
        else{
            console.log("No Pokemon found");
            return [];
        }
    }catch(error){
        console.error(error.message);
        throw error;
    }
};


