
    console.log("Inside client js script");
    const triviaQuestion = document.getElementById('pokemon-trivia-question');
    const pokemonGuessInput = document.getElementById('triviaGuess');
    const submitGuessButton = document.getElementById('submitGuess');
    const resultMessage = document.getElementById('resultMessage');
    const playAgainButton = document.getElementById('playAgainButton');
    // Fetch Pokémon and set up the question
    const fetchPokemonAndSetQuestion = async () => {
        try {
            pokemonGuessInput.value = "";  
            resultMessage.textContent = ""; 
            // Fetch Pokémon from the backend
            let response = await fetch('/trivia/getRandomPokemonByCount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Tell the server you're sending JSON
                },
                body: JSON.stringify({ count: 1 }) // Send the 'count' parameter
            });
            let pokemonList = await response.json();
            if(pokemonList){
                let pokemon = pokemonList[0];
                console.log("Data function loaded!");
                console.log(pokemon);
                // Extract abilities, types, and moves
                let abilities = []
                for(let obj of pokemon.abilities){
                    abilities.push(obj.ability.name);
                }
                console.log(abilities);
                let types = []
                for(let obj of pokemon.types){
                    types.push(obj.type.name);
                }
                console.log(types);
                let moves = []
                for(let obj of pokemon.moves){
                    moves.push(obj.moveName);
                }
                console.log(moves);

                // Randomly select a question type
                let randomNumber = Math.floor(Math.random() * 3);

                // Get DOM elements
               
                console.log("Reached point before question updates");
                // Set the trivia question based on the random number
                if (randomNumber === 0) {
                    triviaQuestion.textContent = `Can you name one of ${pokemon.name}'s abilities?`;
                } else if (randomNumber === 1) {
                    triviaQuestion.textContent = `Can you name one of ${pokemon.name}'s types?`;
                } else {
                    triviaQuestion.textContent = `Can you name one of ${pokemon.name}'s moves?`;
                }
                console.log("Reached point after question updates");
                // Define the checkGuess function
                const checkGuess = () => {
                    const userGuess = pokemonGuessInput.value.trim().toLowerCase();
                    if (randomNumber === 0 && abilities.includes(userGuess)) {
                        resultMessage.textContent = 'Correct! 🎉';
                        resultMessage.style.color = 'green';
                        playAgainButton.style.display = 'block';
                    } else if (randomNumber === 1 && types.includes(userGuess)) {
                        resultMessage.textContent = 'Correct! 🎉';
                        resultMessage.style.color = 'green';
                        playAgainButton.style.display = 'block';
                    } else if (randomNumber === 2 && moves.includes(userGuess)) {
                        resultMessage.textContent = 'Correct! 🎉';
                        resultMessage.style.color = 'green';
                        playAgainButton.style.display = 'block';
                    } else {
                        resultMessage.textContent = 'Wrong! Try again.';
                        resultMessage.style.color = 'red';
                    }
                };

                // Add event listeners
                submitGuessButton.addEventListener('click', checkGuess);
                playAgainButton.addEventListener('click', fetchPokemonAndSetQuestion);
            }
            else{
                console.log("Data function not returning anything");
            }
            
        } catch (error) {
            console.error("Error fetching Pokémon:", error);
        }
    };

    // Ensure the DOM is fully loaded before running the script
    document.addEventListener('DOMContentLoaded', fetchPokemonAndSetQuestion);
