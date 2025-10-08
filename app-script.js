// API Configuration
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key from https://www.exchangerate-api.com/
const API_URL = 'https://v6.exchangerate-api.com/v6';

// Alternative free API (no key required): https://api.exchangerate-api.com/v4/latest/

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const resultContainer = document.getElementById('resultContainer');
const resultAmount = document.getElementById('resultAmount');
const exchangeRate = document.getElementById('exchangeRate');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');

// Event Listeners
convertBtn.addEventListener('click', convertCurrency);
swapBtn.addEventListener('click', swapCurrencies);
amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        convertCurrency();
    }
});

// Swap currencies function
function swapCurrencies() {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
}

// Main conversion function
async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    // Validate input
    if (isNaN(amount) || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }

    if (fromCurrency === toCurrency) {
        showError('Please select different currencies');
        return;
    }

    // Hide previous results and errors
    hideError();
    hideResult();
    showLoading();

    try {
        // Fetch exchange rate data
        // Using the free API (no key required)
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        
        // Get the exchange rate
        const rate = data.rates[toCurrency];
        
        if (!rate) {
            throw new Error('Exchange rate not available');
        }

        // Calculate converted amount
        const convertedAmount = (amount * rate).toFixed(2);

        // Display result
        displayResult(amount, fromCurrency, convertedAmount, toCurrency, rate);

    } catch (error) {
        console.error('Conversion error:', error);
        showError('Could not fetch data. Please try again later.');
    } finally {
        hideLoading();
    }
}

// Alternative function using ExchangeRate-API with API key (if you have one)
async function convertCurrencyWithKey() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }

    if (fromCurrency === toCurrency) {
        showError('Please select different currencies');
        return;
    }

    hideError();
    hideResult();
    showLoading();

    try {
        const response = await fetch(`${API_URL}/${API_KEY}/pair/${fromCurrency}/${toCurrency}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        
        if (data.result !== 'success') {
            throw new Error('API request was not successful');
        }

        const rate = data.conversion_rate;
        const convertedAmount = (amount * rate).toFixed(2);

        displayResult(amount, fromCurrency, convertedAmount, toCurrency, rate);

    } catch (error) {
        console.error('Conversion error:', error);
        showError('Could not fetch data. Please try again later.');
    } finally {
        hideLoading();
    }
}

// Display result function
function displayResult(amount, fromCurrency, convertedAmount, toCurrency, rate) {
    resultAmount.textContent = `${convertedAmount} ${toCurrency}`;
    exchangeRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    showResult();
}

// UI Helper Functions
function showResult() {
    resultContainer.classList.add('show');
}

function hideResult() {
    resultContainer.classList.remove('show');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

function showLoading() {
    loading.classList.add('show');
}

function hideLoading() {
    loading.classList.remove('show');
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Initialize - Optional: Load some default conversion on page load
window.addEventListener('DOMContentLoaded', () => {
    console.log('Currency Converter initialized');
    console.log('Developed by: Guinea, Clide, and Estrelle');
});