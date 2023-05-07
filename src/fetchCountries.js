function fetchCountries(name) {
  const BASE_URL = ' https://restcountries.com/v3.1';
  const END_POINT_COUNTRY_NAME = `/name/${name}`;
  const URL = `${BASE_URL}${END_POINT_COUNTRY_NAME}?fields=name,capital,population,flags,languages`;
  return fetch(URL).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}
export { fetchCountries };
