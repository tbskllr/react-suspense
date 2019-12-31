import sleep from "sleep-promise";

export function suspensify(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    response => {
      status = "success";
      result = response;
    },
    error => {
      status = "error";
      result = error;
    }
  );

  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      if (status === "success") return result;
    }
  };
}

export function fetchGermany(name) {
  return fetch(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
    .then(res => res.json())
    .then(sleep(500));
}

// export function fetchPokemonCollection() {
//   return fetch(`https://pokeapi.co/api/v2/pokemon/`)
//     .then(res => res.json())
//     .then(res => ({
//       ...res,
//       results: res.results.map(pokemon => ({
//         ...pokemon,
//         id: pokemon.url.split("/")[6]
//       }))
//     }))
//     .then(sleep(1000));
// }

export function fetchAllCountries() {
  return fetch(`https://restcountries.eu/rest/v2/all`)
    .then(res => res.json())
    .then(res => ({
      results: res.map(country => ({
        ...country
      }))
    }))
    .then(sleep(1000));
}
