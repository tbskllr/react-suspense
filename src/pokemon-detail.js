import React from "react";
import { DelaySpinner } from "./ui";
import { PokemonContext } from "./pokemon";

export default function PokemonDetail() {
  let { pokemon: resource, isStale } = React.useContext(PokemonContext);
  let pokemon = resource.read();
  console.log(pokemon);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <article style={isStale ? { opacity: 0.5 } : null}>
      <section className="detail-header">
        <div>
          <h2 className="pokemon-title">
            {pokemon[0].name} {isStale && <DelaySpinner />}
          </h2>

          <div className="pokemon-type-container">
            <h4>Capital City: {pokemon[0].capital}</h4>
            <ul style={{ padding: 0 }}></ul>
          </div>
        </div>
      </section>

      <section>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-header">
              {numberWithCommas(pokemon[0].population)}
            </span>
            <span className="stat-body">Population</span>
          </div>
          <div className="stat-item">
            <span className="stat-header">{pokemon[0].region}</span>
            <span className="stat-body">Region</span>
          </div>
          <div className="stat-item">
            <span className="stat-header">{pokemon[0].currencies[0].name}</span>
            <span className="stat-body">currency</span>
          </div>
        </div>
      </section>
    </article>
  );
}
