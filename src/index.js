import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector('.country-list');
const countryDiv = document.querySelector('.country-info');
const input = document.querySelector('#search-box');
input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
function onInput(event) {
  const name = event.target.value.trim();
  let quantityObjects;
  fetchCountries(name)
    .then(data => {
      data.forEach((_, i) => {
        quantityObjects = i + 1;
        return quantityObjects;
      });
      if (quantityObjects > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (quantityObjects === 1) {
        countryDiv.innerHTML = createMarkupDiv(data);
        countryList.innerHTML = '';
      } else if (quantityObjects > 1 && quantityObjects < 10) {
        countryDiv.innerHTML = '';
        countryList.innerHTML = createMarkupList(data);
      }
    })
    .catch(
      err => Notify.failure('Oops, there is no country with that name'),
      (countryDiv.innerHTML = ''),
      (countryList.innerHTML = '')
    );
}
function createMarkupDiv(arr) {
  return arr
    .map(
      ({
        flags: { svg, alt },
        name: { official },
        capital,
        population,
        languages,
      }) => {
        const countryLanguages = Object.values(languages)
          .map(item => item)
          .join(', ');
        if (official === 'Ukraine') {
          return `<div class="ukraine-box">
        <div class="country-info-box">
          <img class="country-image" src="${svg}" alt="${alt}" />
          <h2 class="country-title">${official}</h2>
        </div>
        <p class="country-text">Capital: <span class="country-span">${capital[0]}</span></p>
        <p class="country-text">Population: <span class="country-span">${population}</span></p>
        <p class="country-text">Languages: <span class="country-span">${countryLanguages}</span></p>
        </div>`;
        }
        return `
        <div class="country-info-box">
          <img class="country-image" src="${svg}" alt="${alt}" />
          <h2 class="country-title">${official}</h2>
        </div>
        <p class="country-text">Capital: <span class="country-span">${capital[0]}</span></p>
        <p class="country-text">Population: <span class="country-span">${population}</span></p>
        <p class="country-text">Languages: <span class="country-span">${countryLanguages}</span></p>`;
      }
    )
    .join('');
}
function createMarkupList(arr) {
  return arr
    .map(
      ({ flags: { svg, alt }, name: { official } }) =>
        `<li class="country-item">
        <img class="country-image" src="${svg}" alt="${alt}">
        <h2>${official}</h2>
    </li>`
    )
    .join('');
}
