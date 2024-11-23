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
    }
}

export const getPokemonByType = async (type) => {
    try{
        type = validation.checkString(type, "Type").toLowerCase();
        // now query the database and return the pokemon
        let pokemonCollection = await pokemon();
        let queriedPokemon = await pokemonCollection.find({"types.name": type}).toArray();
        if(queriedPokemon){
            return queriedPokemon;
        }
        else{
            console.log("No Pokemon found");
        }
    }catch(error){
        console.error(error.message);
    }
}


