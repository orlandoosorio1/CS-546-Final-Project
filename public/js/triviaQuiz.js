
    console.log("Inside client js script");
    const triviaQuestion = document.getElementById('pokemon-trivia-question');
    const pokemonGuessInput = document.getElementById('triviaGuess');
    const submitGuessButton = document.getElementById('submitGuess');
    const resultMessage = document.getElementById('resultMessage');
    const playAgainButton = document.getElementById('playAgainButton');
    // Fetch Pokémon and set up the question
    const fetchPokemonAndSetQuestion = async () => {
        try {
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
                // Extract abilities, types, and moves
                let abilities = pokemon.abilities.map(obj => obj.ability.name.toLowerCase());
                let types = pokemon.types.map(obj => obj.type.name.toLowerCase());
                let moves = pokemon.moves.map(obj => obj.move.name.toLowerCase());

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