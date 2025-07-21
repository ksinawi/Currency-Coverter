//* selectors

const key = "fca_live_kUsjfY8RXEmIRZhIUOyTfnqytFKIqmhFxwebm39c";

let currencies = [];
let rates = {};

let activeButton = null;

const ui = {
    fromButton: document.getElementById('from-button'),
    toButton: document.getElementById('to-button'),
    optionsPanel: document.getElementById('options-drop-down'),
    closeButton: document.getElementById('close-drop-down'),

    fromAmount: document.getElementById('from-amount'),
    toAmount: document.getElementById('to-amount'),

    optionList: document.getElementById('option-list'),
    searchBar: document.getElementById('search'),

    switchButton: document.getElementById('switch'),
};

//* event listeners

function eventListeners () {
    document.addEventListener('DOMContentLoaded', displayList)
    ui.fromButton.addEventListener('click', showOptions); 
    ui.toButton.addEventListener('click', showOptions); 
    ui.closeButton.addEventListener('click', hideOptions);
    
    ui.fromAmount.addEventListener('input', getInput);

    ui.optionList.addEventListener('click', changeOption);
    ui.searchBar.addEventListener('keyup', searchCurrency)

    ui.switchButton.addEventListener('click', switchOptions);
}

//* event handlers

function displayList () {
    fetchCurrencies();
}

function showOptions (event) {
    
    renderCurrencies(currencies);
    ui.optionsPanel.classList.remove('hidden');

    if (event.target === ui.fromButton) {
        activeButton = 'from';
    } else if (event.target === ui.toButton) {
        activeButton = 'to';
    }
}

function hideOptions() {
    ui.optionsPanel.classList.add('hidden');
}

function getInput () {
    const userInput = ui.fromAmount.value;
    calculateExchangeRate (userInput);
}


function changeOption(event) {

    const listItem = event.target.closest('li');
    if (!listItem) return;

    const codeElement = listItem.querySelector('.option-list-currency');
    if (!codeElement) return;

    const chosenCurrencyCode = codeElement.innerText;

    if (activeButton === 'from') {
        ui.fromButton.innerText = chosenCurrencyCode;
    } else if (activeButton === 'to') {
        ui.toButton.innerText = chosenCurrencyCode;
    }

    ui.fromAmount.value = 0;
    ui.toAmount.value = 0;
    hideOptions();
}

function switchOptions () {
    const originalFrom = ui.fromButton.innerText;
    const originalTo = ui.toButton.innerText;

    ui.fromButton.innerText = originalTo;
    ui.toButton.innerText = originalFrom;

    calculateExchangeRate(ui.fromAmount.value);
}

function searchCurrency () {
    let userInput = ui.searchBar.value.toLowerCase();
    
    const matches = currencies.filter(currency =>
        currency.name.toLowerCase().includes(userInput) ||
        currency.code.toLowerCase().includes(userInput)
    );

    renderCurrencies(matches);
}



//* render functions


function renderCurrencies (currencies) {

    let currenciesHTML = '';
    
    currencies.forEach((currency) => {
        currenciesHTML += 
        `
        <li>
            <img src="${currency.image}" class="option-list-img">
            <div>
                <p class="option-list-currency">${currency.code}</p>
                <p class="option-list-name">${currency.name}</p>
            </div>
        </li>
        `
    });

    ui.optionList.innerHTML = currenciesHTML;
}

//* helper functions

function calculateExchangeRate (input) {
    let result = 0;

    const toRate = rates[ui.toButton.innerText];
    const fromRate = rates[ui.fromButton.innerText];

    if (ui.fromButton.innerText === 'USD') {
        result = input * toRate;
        document.querySelector('.exchange-rate-currency').innerHTML = toRate;
    } else {
        result = input * (toRate / fromRate);
        document.querySelector('.exchange-rate-currency').innerHTML = toRate / fromRate;
    }
    
    ui.toAmount.value = result;
}

//* api functions

function fetchCurrencies () {
    fetch(`https://api.freecurrencyapi.com/v1/currencies?apikey=fca_live_kUsjfY8RXEmIRZhIUOyTfnqytFKIqmhFxwebm39c&currencies=`)
        .then((response) => {
            if (!response.ok) throw new Error("Error: Network Repsonse");
            return response.json();
        })
        .then(data => {
            currencies = Object.entries(data.data).map(([code, currency]) => {
                return {
                    code: code,
                    name: currency.name,
                    symbol: currency.symbol,
                    image: `./images/flags/${code}.png`,
                };
            });
        })

        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

function fetchRate() {
    fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_kUsjfY8RXEmIRZhIUOyTfnqytFKIqmhFxwebm39c`)
        .then((response) => {
            if (!response.ok) throw new Error("Error: Network Response");
            return response.json();
        })
        .then(data => {
            rates = data.data; 
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

//* initialization
eventListeners();
fetchRate();
