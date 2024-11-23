// this file is going to populate the mongo collection with pokemon

import axios from 'axios';
import { pokemon } from '../config/mongoCollections.js';

// define the endpoint to check first
let endpoint = 'https://pokeapi.co/api/v2/pokemon?limit=151';

let populateDatabase = async () => {
    try{
        let pokemonCollection = await pokemon();
        // the first step is to check if the pokemon collection is already populated and if not then we populate else we don't
        let count = await pokemonCollection.countDocuments();
        // if its filled, we're good
        if(count > 0){
            let samplePokemon = await pokemonCollection.find({}).limit(5).toArray();
            //console.log(samplePokemon);
            return;
        }
        // if we are here, the database is not filled and now we need to get the first 151 pokemon and fill the database
        // first step - make the request to the axios endpoint and then get the initial list
        let {data} = await axios.get(endpoint);
        // now, considering that this returns a list of objects for each pokemon and the url to get the data for each pokemon, 
        // we now have to iterate through keach object, grab the url, make a get request to it, get its info, and make an object
        // and then store all thsoe objects inside an array to then put into the database
        
        // define list of objects that will be put into the database
        let finalPokemon = [];
        for (let obj of data.results){
            let {url} = obj;
            let {data: {name, abilities, types, cries, moves, ...restInfo}} = await axios.get(url);
            let newObj = {name, abilities, types, cries, moves};
            // moves requires more code because it has objects and list of objects nested inside it. 
            // we can do this by creating a function
            let processedMoves = moves.map(moveEntry => {
                // extract the move name and the url
                let moveName = moveEntry.move.name;
                let moveUrl = moveEntry.move.url;
                // now extract version group details
                let versionDetails = moveEntry.version_group_details.map(detail => ({
                    levelLearnedAt: detail.levelLearnedAt, 
                    moveLearnMethod: detail.move_learn_method.name, 
                    versionGroupName: detail.version_group_name 
                }))
                return {
                    moveName, 
                    moveUrl, 
                    versionDetails
                };
            })
            newObj.moves = processedMoves;
            finalPokemon.push(newObj);
        }
        // console.log(finalPokemon);
        // now, finally, add all pokemon to the database
        pokemonCollection.insertMany(finalPokemon);
        console.log("Pokemon added to database.")
        // try testing by getting example pokemon
        let samplePokemon = await pokemonCollection.find({}).limit(5).toArray();
        console.log(samplePokemon);
 
    }catch(error){
        console.error(error.message);
    }
}

export default populateDatabase;