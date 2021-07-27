import { useState, useEffect } from 'react';

import axios from 'axios';

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

  const handleCountriesToShow = () => {
    if (countriesToShow.length === 0) {
      return;
    }

    if (countriesToShow.length > 10) {
      return <div>Too many matches, specify another filter</div>;
    }

    if (countriesToShow.length === 1) {
      const { name, capital, population, languages, flag } = countriesToShow[0];
      const altFlag = `flag of ${name}`;

      return (
        <>
          <h1>{name}</h1>
          <div>capital {capital}</div>
          <div>population {population}</div>
          <h2>Spoken languages</h2>
          <ul>
            {languages.map((lng) => (
              <li key={lng.name}>{lng.name}</li>
            ))}
          </ul>
          <img src={flag} width={100} alt={altFlag} />
        </>
      );
    } else {
      return countriesToShow.map((c) => (
        <div key={c.name}>
          {c.name} <button onClick={(e) => handleShowCountry(c)}>show</button>
        </div>
      ));
    }
  };

  const handleWeather = () => {
    if (!weather.current || !countriesToShow[0]) {
      return;
    } else {
      const { temperature, weather_icons, wind_speed, wind_dir } =
        weather.current;
      const altWeather = `weather in ${countriesToShow[0].capital}`;

      return (
        <>
          <h2>Weather in {countriesToShow[0].capital}</h2>
          <div>
            <b>temperature:</b> {temperature} Celsius
          </div>
          <img src={weather_icons[0]} width={50} alt={altWeather} />
          <div>
            <b>wind:</b> {wind_speed} km/h direction {wind_dir}
          </div>
        </>
      );
    }
  };

  return (
    <div>
      <div>
        find countries <input value={country} onChange={handleCountry} />
      </div>
      {handleCountriesToShow()}
      {handleWeather()}
    </div>
  );
};

export default App;
