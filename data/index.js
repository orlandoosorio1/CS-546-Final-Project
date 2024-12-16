import * as userFunctions  from './users.js';
import {getPokemonByName, getPokemonByType, getRandomPokemonByCount } from './pokemon.js';
import * as teamFunctions from './teams.js';

export const usersData = userFunctions;
export const pokemonData = {getPokemonByName, getPokemonByType, getRandomPokemonByCount };
export const teamData = teamFunctions;