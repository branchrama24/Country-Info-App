import React from 'react';

const CountryList = ({ countries, onSelect }) => {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Available Countries</h2>
      <ul className="list-disc pl-5">
        {countries.map((country) => (
          <li
            key={country.alpha2Code || country.name} // Asegúrate de que alpha2Code sea único. Si no, usa el nombre como alternativa.
            className="cursor-pointer hover:text-blue-500"
            onClick={() => onSelect(country.alpha2Code)} // Aquí se llama la función
          >
            {country.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;

