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
        if(count >0 ){
            return;
        }
        // if we are here, the database is not filled and now we need to get the first 151 pokemon and fill the database
        // first step - make the request to the axios endpoint and then get the initial list
        let {data} = await axios.get(endpoint);
        console.log(data);
        // now, considering that this returns a list of objects for each pokemon and the url to get the data for each pokemon, 
        // we now have to iterate through each object, grab the url, make a get request to it, get its info, and make an object
        // and then store all thsoe objects inside an array to then put into the database
        for (let obj of data.results){
            let {name, url} = obj;
            let {data: pokemonData} = await axios.get(url);
            console.log(pokemonData);
        }
 
    }catch(error){
        console.error(error.message);
    }
}

export default populateDatabase;