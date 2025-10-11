// Import helper to map currency to country flags
import { currencyToFlagCode } from './currency-to-flag-code.js'

// Select elements from the DOM
const inputSourceCurrency = document.getElementById('inputSourceCurrency');

const currencySelectElements = document.querySelectorAll('.currency-converter_select select');

//Flag Image Icon elements
const imageSourceCurrency = document.getElementById('imageSourceCurrency');
const selectSourceCurrency = document.getElementById('selectSourceCurrency');

const imageTargetCurrency = document.getElementById('imageTargetCurrency');
const selectTargetCurrency = document.getElementById('selectTargetCurrency');

const buttonSwap = document.getElementById('buttonSwap');

const exchangeRateText = document.getElementById('exchangeRateText');
const buttonConvert = document.getElementById('buttonConvert');

const API_Key = 'b20b342878a7581b47213640';
//Declare variables
let isFetching = false;
let conversionRate = 0;
let sourceCurrentValue = 0;
let targetCurrentValue = 0;

// Swap source and target currencies
buttonSwap.addEventListener('click', () => {
    //Swap select values
    [selectSourceCurrency.value, selectTargetCurrency.value] = [selectTargetCurrency.value, selectSourceCurrency.value];
    //Swap country flag
    [imageSourceCurrency.src, imageTargetCurrency.src] = [imageTargetCurrency.src, imageSourceCurrency.src];
    //Swap convertion rate
    inputSourceCurrency.value = targetCurrentValue;

    if(isFetching){
        //Reverse conversion rate
        conversionRate = 1 / conversionRate;
    }
    updateExchangeRate();
})

// Update exchange rate upon input
inputSourceCurrency.addEventListener('input', event => {
    //Update Exchange Rate
    if (isFetching && inputSourceCurrency.value > 0) {
        updateExchangeRate();
    }
})

// Perform conversion when button is clicked
buttonConvert.addEventListener('click',async ()=> {
    //When input is less then or equal to 0
    if (inputSourceCurrency.value <= 0) {
        alert('Please enter a valid amount.')
        return; //Stop execution
    }
    exchangeRateText.textContent = 'Fetching exchange rate, please wait...';

    const selectSourceCurrencyValue = selectSourceCurrency.value;
    const selectTargetCurrencyValue = selectTargetCurrency.value;
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_Key}/pair/${selectSourceCurrencyValue}/${selectTargetCurrencyValue}`);
        const data = await response.json();
        conversionRate = data.conversion_rate;
       
        isFetching = true;
        updateExchangeRate();
    } catch (error) {
        console.log('Error fetching exchange rate!', error);
        exchangeRateText.textContent = 'Error fetching exchange rate!'
    }
});
// Update exchange rate displayed
function updateExchangeRate() {
    sourceCurrentValue = parseFloat(inputSourceCurrency.value);
    targetCurrentValue = (sourceCurrentValue * conversionRate).toFixed(2);

    exchangeRateText.textContent = `${formatCurrency(sourceCurrentValue)} ${selectSourceCurrency.value} 
    = ${formatCurrency(targetCurrentValue)} ${selectTargetCurrency.value}`
}


// Initialize select menus and flags
currencySelectElements.forEach(selectElement => {
    for (const [currency, flagCode] of Object.entries(currencyToFlagCode)) {
        const newOptionElement = document.createElement('option');
        newOptionElement.value = currency;
        newOptionElement.textContent = currency;
        selectElement.appendChild(newOptionElement);
    }
    //Listen of Changes
    selectElement.addEventListener('change', () => {
        inputSourceCurrency.value = 0;
        isFetching = false;
        updateExchangeRate();
        changeFlag(selectElement);
    });
    
    //Set default select values
    if (selectElement.id === 'selectSourceCurrency') {
        selectElement.value = 'USD';  
    }
    //Set default target values
    if (selectElement.id === 'selectTargetCurrency') {
        selectElement.value = 'PHP';  
    }
})

// Change country flags upon select
function changeFlag(selectElement) {
    const selectValue = selectElement.value;
    const selectId = selectElement.id;
    const flagCode = currencyToFlagCode[selectValue];
    
    if (selectId === 'selectSourceCurrency') {
        imageSourceCurrency.src = `https://flagcdn.com/w640/${flagCode}.png`;
    } else {
        imageTargetCurrency.src = `https://flagcdn.com/w640/${flagCode}.png`;
    }
    
}
// Format currency
function formatCurrency(number) {
    return new Intl.NumberFormat().format(number);
}