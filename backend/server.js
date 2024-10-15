const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint: Get Available Countries
app.get('/countries', async (req, res) => {
    try {
        console.log('Fetching available countries...');
        const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching countries:', error.message);
        res.status(500).json({ message: 'Error fetching countries', error: error.message });
    }
});

// Endpoint: Get Country Info
app.get('/countries/:countryCode', async (req, res) => {
    const countryCode = req.params.countryCode.toUpperCase();
    console.log(`Fetching data for country: ${countryCode}`);

    // Validar countryCode
    if (!countryCode || countryCode.length !== 2) {
        return res.status(400).json({ message: 'Invalid country code. Must be a 2-letter code.' });
    }

    try {
        // Obtener información en paralelo
        const [borderCountriesResponse, populationResponse, flagResponse] = await Promise.all([
            axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`),
            axios.get('https://countriesnow.space/api/v0.1/countries/population'),
            axios.get('https://countriesnow.space/api/v0.1/countries/flag/images')
        ]);

        // Validar respuestas
        const borderCountries = borderCountriesResponse.data?.borders || [];
        const populationData = populationResponse.data?.data?.find(country => country.country === countryCode);
        const flagData = flagResponse.data?.data?.find(country => country.name === countryCode);

        // Comprobar si los datos existen
        if (!populationData) {
            return res.status(404).json({ message: 'Population data not found for the specified country code.' });
        }
        if (!flagData) {
            return res.status(404).json({ message: 'Flag data not found for the specified country code.' });
        }

        // Responder con los datos obtenidos
        res.json({
            borderCountries,
            population: populationData.population,
            flag: flagData.flag
        });
    } catch (error) {
        // Manejo de errores mejorado
        console.error('Error fetching country info:', error.message);
        res.status(500).json({ message: 'Error fetching country info', error: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
