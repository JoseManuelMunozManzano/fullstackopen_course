import { useState, useEffect } from 'react';

import axios from 'axios';

import { Filter } from './components/Filter';
import { Countries } from './components/Countries';
import { Weather } from './components/Weather';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('');
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [weather, setWeather] = useState({});

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then((response) => setCountries(response.data));
  }, []);

  useEffect(() => {
    if (country !== '') {
      const show = countries.filter((c) =>
        c.name.toUpperCase().includes(country.toUpperCase())
      );

      setCountriesToShow(show);
    } else {
      setCountriesToShow([]);
    }
  }, [country, countries]);

  useEffect(() => {
    if (countriesToShow.length === 1) {
      const weatherUrl = `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${countriesToShow[0].capital}`;

      axios.get(weatherUrl).then((response) => setWeather(response.data));
    } else {
      setWeather({});
    }
  }, [setWeather, countriesToShow]);

  const handleCountry = (e) => {
    setCountry(e.target.value);
  };

  const handleShowCountry = (country) => {
    setCountry(country.name);
  };

  return (
    <div>
      <Filter country={country} handleCountry={handleCountry} />
      <Countries
        countriesToShow={countriesToShow}
        handleShowCountry={handleShowCountry}
      />
      <Weather countriesToShow={countriesToShow} weather={weather} />
    </div>
  );
};

export default App;
