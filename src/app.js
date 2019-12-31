import React from "react";
import ErrorBoundary from "./error-boundary";
import { fetchGermany, fetchAllCountries, suspensify } from "./api";
import { DelaySpinner } from "./ui";
import { List } from "./ui";
import { CountryContext } from "./country";

import "./styles.css";

const CountryDetail = React.lazy(() => import("./country-detail"));

let initialCountry = suspensify(fetchGermany("germany"));
let initialCollection = suspensify(fetchAllCountries());

export default function App() {
  let [countryResource, setCountryResource] = React.useState(initialCountry);
  let [collectionResource] = React.useState(initialCollection);
  let [startTransition, isPending] = React.useTransition({ timeoutMs: 3000 });
  let deferredCountryResource = React.useDeferredValue(countryResource, {
    timeoutMs: 3000
  });

  let countryIsPending = deferredCountryResource !== countryResource;

  let countryState = {
    country: deferredCountryResource,
    isStale: countryIsPending,
    setCountry: id =>
      startTransition(() => setCountryResource(suspensify(fetchGermany(id))))
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="container">
      <br />
      <CountryContext.Provider value={countryState}>
        <React.SuspenseList revealOrder="forwards" tail="collapsed">
          <React.Suspense fallback={<div>Fetching Country stats...</div>}>
            <ErrorBoundary fallback="Couldn't catch 'em all.">
              <CountryDetail />
            </ErrorBoundary>
          </React.Suspense>

          <React.Suspense fallback={<div>Connecting to database...</div>}>
            <ErrorBoundary fallback="Couldn't catch 'em all.">
              <div>{isPending && <DelaySpinner />}</div>
              <br />
              <br />
              <CountryContext.Consumer>
                {({ setCountry }) => (
                  <CountryCollection
                    resource={collectionResource}
                    as="ul"
                    className="country-list"
                    renderItem={country => (
                      <button
                        className="country-list-item-button"
                        type="button"
                        disabled={isPending}
                        onClick={() => setCountry(country.name)}
                      >
                        <li key={country.name} className="country-list-item">
                          <h3>{country.name}</h3>
                          <p>Capital City: {country.capital}</p>
                          <p>
                            Population: {numberWithCommas(country.population)}
                          </p>
                        </li>
                      </button>
                    )}
                  />
                )}
              </CountryContext.Consumer>
            </ErrorBoundary>
          </React.Suspense>
        </React.SuspenseList>
      </CountryContext.Provider>
    </div>
  );
}

function CountryCollection({ resource, ...props }) {
  return (
    <List
      items={resource
        .read()
        .results.sort((a, b) => (a.population < b.population ? 1 : -1))}
      {...props}
    />
  );
}
