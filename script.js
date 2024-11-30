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
    document.getElementById('reward-message').innerText = 'You have claimed 100 satoshis!';
}

// Update live price on page load
updateLivePrice();