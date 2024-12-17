console.log("Inside client js script");

// Get DOM elements
const triviaQuestion = document.getElementById('pokemon-trivia-question');
const pokemonGuessInput = document.getElementById('triviaGuess');
const submitGuessButton = document.getElementById('submitGuess');
const resultMessage = document.getElementById('resultMessage');
const playAgainButton = document.getElementById('playAgainButton');

// Game state variables
let correctGuesses = 0;
let question = 0;
const totalRounds = 5;

let currentAnswers = []; // Store correct answers for the current question

// Function to fetch Pokémon and set up a question
const fetchPokemonAndSetQuestion = async () => {
    try {
        if (question >= totalRounds) {
            // Game over: show final score
            resultMessage.textContent = `Quiz Complete! 🎉 You scored ${correctGuesses} out of ${totalRounds}.`;
            resultMessage.style.color = 'blue';
            playAgainButton.style.display = 'block';
            submitGuessButton.disabled = true;
            return;
        }

        // Reset UI for the new question
        pokemonGuessInput.value = "";
        resultMessage.textContent = "";
        resultMessage.style.color = "";
        playAgainButton.style.display = "none";
        submitGuessButton.disabled = false;

        // Fetch Pokémon data
        const response = await fetch('/trivia/getRandomPokemonByCount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count: 1 }),
        });
        const pokemonList = await response.json();

        if (pokemonList && pokemonList.length > 0) {
            const pokemon = pokemonList[0];
            console.log("Fetched Pokémon:", pokemon);

            // Extract abilities, types, and moves
            const abilities = pokemon.abilities.map(a => a.ability.name.toLowerCase());
            const types = pokemon.types.map(t => t.type.name.toLowerCase());
            const moves = pokemon.moves.slice(0, 5).map(m => m.moveName.toLowerCase()); // Limit moves to 5

            // Randomly select a question type
            const randomNumber = Math.floor(Math.random() * 3);
            if (randomNumber === 0) {
                triviaQuestion.textContent = `Can you name one of ${pokemon.name}'s abilities?`;
                currentAnswers = abilities;
            } else if (randomNumber === 1) {
                triviaQuestion.textContent = `Can you name one of ${pokemon.name}'s types?`;
                currentAnswers = types;
            } else {
                triviaQuestion.textContent = `Can you name one of ${pokemon.name}'s moves?`;
                currentAnswers = moves;
            }

            console.log("Current answers:", currentAnswers);
        } else {
            console.error("No Pokémon data received.");
        }
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
    }
};

const saveScoreToDatabase = async (triviaScore) => {
    try {
      const response = await fetch('/pokemon/save-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ triviaScore }), // Send score only
      });
  
      if (response.ok) {
        console.log('Score saved successfully.');
      } else {
        const errorData = await response.json();
        console.error('Failed to save score:', errorData.error);
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

// Function to check user's guess
const checkGuess = () => {
    const userGuess = pokemonGuessInput.value.trim().toLowerCase();

    if (currentAnswers.includes(userGuess)) {
        resultMessage.textContent = 'Correct! ';
        resultMessage.style.color = 'green';
        correctGuesses++;
    } else {
        resultMessage.textContent = `Wrong! Correct answers: ${currentAnswers.join(', ')}.`;
        resultMessage.style.color = 'red';
    }

    question++;
    submitGuessButton.disabled = true; // Disable submit temporarily
    setTimeout(fetchPokemonAndSetQuestion, 3000); // Load next question after 3 seconds
};

// Function to reset the game
const resetGame = async () => {
    let result = await saveScoreToDatabase((correctGuesses));
    correctGuesses = 0;
    question = 0;
    currentAnswers = [];
    submitGuessButton.disabled = false;
    fetchPokemonAndSetQuestion();
};

// Attach event listeners ONCE
submitGuessButton.addEventListener('click', checkGuess);
playAgainButton.addEventListener('click', resetGame);

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', fetchPokemonAndSetQuestion);
