let btcToUsd;
const satsInBtc = 1e8;

window.onload = async function() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=jpy%2Cusd&include_last_updated_at=true");
        const data = await response.json();
        btcToUsd = data.bitcoin.usd;
        const updatedAt = new Date(data.bitcoin.last_updated_at * 1000);
        document.getElementById('last-updated').textContent = `last updated：${updatedAt.toLocaleString()}`;
    } catch (err) {
        console.error("Failed to fetch price data from CoinGecko:", err);
        alert("Failed to get price data. Please try reloading the page after a while.");
        return;
    }

    document.getElementById('sats').value = 100;
    calculateValues('sats');

    document.getElementById('btc').addEventListener('focus', function() {
        this.select();
    });
    document.getElementById('sats').addEventListener('focus', function() {
        this.select();
    });
    document.getElementById('usd').addEventListener('focus', function() {
        this.select();
    });

    document.getElementById('btc').addEventListener('keyup', function() {
        addCommasToInput(this);
    });
    document.getElementById('sats').addEventListener('keyup', function() {
        addCommasToInput(this);
    });
    document.getElementById('usd').addEventListener('keyup', function() {
        addCommasToInput(this);
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
    }
}

function calculateValues(inputField) {
    let btc, sats, usd;
    switch(inputField) {
        case 'btc':
            btc = document.getElementById('btc').value.replace(/,/g, '');
            sats = (btc * satsInBtc).toLocaleString();
            usd = (btc * btcToUsd).toLocaleString();
            break;
        case 'sats':
            sats = document.getElementById('sats').value.replace(/,/g, '');
            btc = (sats / satsInBtc).toFixed(8);
            usd = (btc * btcToUsd).toLocaleString();
            break;
    }

    document.getElementById('btc').value = addCommas(btc);
    document.getElementById('sats').value = sats;
    document.getElementById('usd').value = usd;
}

function addCommas(num) {
    let s = num.toString().replace(/[^0-9.]/g, '');
    let b = s.toString().split('.');
    b[0] = b[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    return b.join('.');
}

function addCommasToInput(inputElement) {
    let caretPos = inputElement.selectionStart - inputElement.value.length;
    inputElement.value = addCommas(inputElement.value.replace(/,/g, ''));
    caretPos = caretPos + (inputElement.value.length - caretPos);
    inputElement.selectionStart = caretPos;
    inputElement.selectionEnd = caretPos;
}