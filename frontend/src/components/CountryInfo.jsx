import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link
import PopulationChart from './PopulationChart'; // Importar el gráfico

const CountryInfo = ({ country, borderCountries, population, flag, populationData }) => {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-2xl font-semibold">{country}</h2>
      <img src={flag} alt={`${country} flag`} className="h-24 mb-4" />
      <h3 className="text-lg font-semibold">Population: {population}</h3>
      <h4 className="font-semibold">Border Countries:</h4>
      <ul className="list-disc pl-5">
        {borderCountries.length > 0 ? (
          borderCountries.map((borderCountry) => (
            <li key={borderCountry.alpha2Code || borderCountry}>
              <Link to={`/countries/${borderCountry.alpha2Code || borderCountry}`}>
                {borderCountry.name || borderCountry}
              </Link>
            </li>
          ))
        ) : (
          <p>No border countries available.</p>
        )}
      </ul>
      <h4 className="font-semibold">Population Over Time:</h4>
      <PopulationChart populationData={populationData} />
    </div>
  );
};

export default CountryInfo;
