import React from "react";
import { DelaySpinner } from "./ui";
import { CountryContext } from "./country";

export default function CountryDetail() {
  let { country: resource, isStale } = React.useContext(CountryContext);
  let country = resource.read();
  console.log(country);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <article style={isStale ? { opacity: 0.5 } : null}>
      <section className="detail-header">
        <div>
          <h2 className="country-title">
            {country[0].name} {isStale && <DelaySpinner />}
          </h2>

          <div className="country-type-container">
            <h4>Capital City: {country[0].capital}</h4>
            <ul style={{ padding: 0 }}></ul>
          </div>
        </div>
      </section>

      <section>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-header">
              {numberWithCommas(country[0].population)}
            </span>
            <span className="stat-body">Population</span>
          </div>
          <div className="stat-item">
            <span className="stat-header">{country[0].region}</span>
            <span className="stat-body">Region</span>
          </div>
          <div className="stat-item">
            <span className="stat-header">{country[0].currencies[0].name}</span>
            <span className="stat-body">currency</span>
          </div>
        </div>
      </section>
    </article>
  );
}
