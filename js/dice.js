// Function to generate a random seed for the player
function generatePlayerSeed() {
    return Math.random().toString(36).substring(2, 10);
}

// Function to generate a server seed (this should be securely generated on the server)
function generateServerSeed() {
    return Math.random().toString(36).substring(2, 10);
}

// Function to hash the combination of player and server seeds
function hashSeeds(playerSeed, serverSeed) {
    const combinedSeed = playerSeed + serverSeed;
    return CryptoJS.SHA256(combinedSeed).toString();
}

// Function to simulate a dice roll based on the hash
function rollDice(hash) {
    // Convert the hash to a number between 0 and 1
    const hashNumber = parseInt(hash.slice(0, 8), 16) / Math.pow(2, 32);
    // Map the number to a dice roll (1 to 6)
    const diceRoll = Math.floor(hashNumber * 6) + 1;
    return diceRoll;
}

// Function to handle the dice roll
function handleRoll() {
    const lastGuessTime = localStorage.getItem('lastGuessTime');
    const currentTime = new Date().getTime();

    if (lastGuessTime && currentTime - lastGuessTime < 24 * 60 * 60 * 1000) {
        const timeLeft = Math.ceil((24 * 60 * 60 * 1000 - (currentTime - lastGuessTime)) / (1000 * 60 * 60));
        document.getElementById('reward-message').innerText = `You can only guess once every 24 hours. Please wait ${timeLeft} hours.`;
        return;
    }

    const playerSeed = generatePlayerSeed();
    const serverSeed = generateServerSeed(); // In a real scenario, this should be securely generated and stored on the server

    const hash = hashSeeds(playerSeed, serverSeed);
    const diceRoll = rollDice(hash);

    const guess = parseInt(document.getElementById('guess').value);
    const resultElement = document.getElementById('result');
    const proofElement = document.getElementById('proof');
    const rewardMessageElement = document.getElementById('reward-message');

    resultElement.innerText = `You rolled a ${diceRoll}`;
    proofElement.innerText = `Proof: Player Seed = ${playerSeed}, Server Seed = ${serverSeed}, Hash = ${hash}`;

    if (guess === diceRoll) {
        rewardMessageElement.innerText = 'Congratulations! You guessed the correct number and won 1 satoshi!';
    } else {
        rewardMessageElement.innerText = 'Better luck next time!';
    }

    // Store the current guess time in local storage
    localStorage.setItem('lastGuessTime', currentTime);
}

// Attach the handleRoll function to the button click event
document.getElementById('rollButton').addEventListener('click', handleRoll);