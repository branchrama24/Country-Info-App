import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CountryList from './components/CountryList';
import CountryInfo from './components/CountryInfo';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // State for error message

  // Fetch the list of countries from the backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        console.log('Fetching countries...');
        const response = await axios.get('http://localhost:3000/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error.response ? error.response.data.message : error.message);
        setErrorMessage('Error fetching countries. Please try again later.');
      }
    };

    fetchCountries();
  }, []);

  // Fetch country info when a country is selected
  const handleSelectCountry = async (countryCode) => {
    setErrorMessage(null); // Clear previous error message
    setCountryInfo(null);  // Clear previous country info
    setSelectedCountry(countryCode);

    try {
      console.log(`Fetching info for country: ${countryCode}`);
      const response = await axios.get(`http://localhost:3000/countries/${countryCode}`);
      
      // Check if valid data exists
      if (!response.data.borderCountries || !response.data.population || !response.data.flag) {
        throw new Error('Invalid country data');
      }

      setCountryInfo(response.data);
    } catch (error) {
      console.error('Error fetching country info:', error.response ? error.response.data.message : error.message);
      setErrorMessage(error.response ? error.response.data.message : 'Country not found or an error occurred.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Country Information</h1>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/3 p-2">
          <CountryList countries={countries} onSelect={handleSelectCountry} />
        </div>
        <div className="w-full md:w-2/3 p-2">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Show error message */}
          {countryInfo && (
            <CountryInfo 
              country={selectedCountry}
              borderCountries={countryInfo.borderCountries}
              population={countryInfo.population}
              flag={countryInfo.flag}
              populationData={countryInfo.populationData} // Asegúrate de pasar la población histórica
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
