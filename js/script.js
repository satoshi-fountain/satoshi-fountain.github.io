const API_KEY = 'f54da49b-93c7-4823-8355-29957d0f6585'; // Replace with your Livecoinwatch API key

async function fetchBitcoinPrice() {
    const response = await fetch('https://api.livecoinwatch.com/coins/single', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-api-key': API_KEY
        },
        body: JSON.stringify({
            currency: 'USD',
            code: 'BTC',
            meta: true
        })
    });
    const data = await response.json();
    return data.rate;
}

async function updateLivePrice() {
    const bitcoinPrice = await fetchBitcoinPrice();
    document.getElementById('live-price').innerText = `$${bitcoinPrice.toFixed(4)}`;
}

async function calculate() {
    const amount = parseFloat(document.getElementById('amount').value);
    const unit = document.getElementById('unit').value;
    const bitcoinPrice = await fetchBitcoinPrice();

    let result;
    if (unit === 'satoshi') {
        result = (amount / 100000000) * bitcoinPrice;
    } else if (unit === 'bitcoin') {
        result = amount * bitcoinPrice;
    }

    document.getElementById('result').innerText = `$${result.toFixed(4)}`;
}

function claimReward() {
    const lastClaimTime = localStorage.getItem('lastClaimTime');
    const currentTime = new Date().getTime();

    if (lastClaimTime && currentTime - lastClaimTime < 2.4 * 60 * 60 * 1000) {
        const timeLeft = Math.ceil((2.4 * 60 * 60 * 1000 - (currentTime - lastClaimTime)) / (1000 * 60 * 60));
        document.getElementById('reward-message').innerText = `You can only claim a reward once every 2.4 hours. Please wait ${timeLeft} hours.`;
        return;
    }

    document.getElementById('reward-message').innerText = 'You have claimed 100 satoshis!';

    // Store the current claim time in local storage
    localStorage.setItem('lastClaimTime', currentTime);
}

// Update live price on page load
updateLivePrice();