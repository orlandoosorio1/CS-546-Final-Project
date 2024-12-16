import { Router } from 'express';
import axios from 'axios';

const router = Router();

//Encyclopedia Page with Searching and Filtering Pokémon
router.get('/', async (req, res) => {
  try {
    const query=req.query.name || '';
    const type=req.query.type || '';
    const apiUrl=`https://pokeapi.co/api/v2/pokemon?limit=151`;

    const { data } = await axios.get(apiUrl);
    let pokemonList = data.results;

    //To search specific Pokémon in the Search Bar
    if (query){
      pokemonList = pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    //Rendering Pokémon Encyclopedia
    res.render('encyclopedia', {
      title: 'Pokémon Encyclopedia',
      pokemonList,
      query,
      type
    });
  } catch (e){
    //errors if otherwise
    console.error('Error fetching Pokémon:', error.message);
    res.status(500).send('Error loading the Pokémon Encyclopedia.');
  }
});

//Fetch Pokemon Details when User clicks on an entry (Pokémon)
router.get('/:name', async (req, res) => {
  try {
    const { name }=req.params;
    const apiUrl=`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;

    const { data }=await axios.get(apiUrl);

    //Create pokemon details object to pass 
    const details = {
      name: data.name,
      id: data.id,
      image: data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      stats: data.stats.map(s => ({
        name: s.stat.name,
        value: s.base_stat
      })),
      height: data.height,
      weight: data.weight
    };

    //And render the pokemon details
    res.render('pokemon-details', { title: `${details.name} Details`, details });
  }catch(e){
    //errrors if otherwise
    console.error('Error fetching Pokémon details:', error.message);
    res.status(404).send('Error loading Pokémon details.');
  }
});

export default router;
