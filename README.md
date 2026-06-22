### console nvigateur

#### pokedollars

set pokedollars =localStorage.setItem('poke_pokedollars',1000000000)

#### click eggs cmd:

const buyBtn = document.querySelector('button.mart-buy[data-egg="legendary"]');
let clicks = 0;
const interval = setInterval(() => {
    console.log(`${clicks}`);
    const overlay = document.querySelector('#egg-overlay');
  if (overlay) {
    overlay.click();
  }
  if (clicks >= 10000 || !buyBtn || buyBtn.disabled) {
    clearInterval(interval);
    console.log(`Stopped after ${clicks} clicks`);
    return;
  }
  buyBtn.click();
  clicks++;
}, 1);


const buyBtn = document.querySelector('button.mart-buy[data-egg="shiny"]');
let clicks = 0;
const interval = setInterval(() => {
    console.log(`${clicks}`);
    const overlay = document.querySelector('#egg-overlay');
  if (overlay) {
    overlay.click();
  }
  if (clicks >= 10000 || !buyBtn || buyBtn.disabled) {
    clearInterval(interval);
    console.log(`Stopped after ${clicks} clicks`);
    return;
  }
  buyBtn.click();
  clicks++;
}, 1);


ev:

const interval = setInterval(() => {
    const card = [...document.querySelectorAll('#vitamin-grid .dex-card')]
        .find(card => {
            const badge = card.querySelector('.vitamin-ev-badge b');
            return badge && badge.textContent.trim() !== '10/10';
        });

    if (!card) {
        clearInterval(interval);
        console.log('Toutes les cartes sont à 10/10');
        return;
    }

    const name = card.querySelector('.dex-name')?.textContent;
    const level = card.querySelector('.vitamin-ev-badge b')?.textContent;

    console.log(`Click ${name} (${level})`);
    card.click();

}, 1);