import { useState, useEffect } from 'react';

import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('');
  const [countriesToShow, setCountriesToShow] = useState([]);

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
      const alt = `flag of ${name}`;

      return (
        <>
          <h1>{name}</h1>
          <div>capital {capital}</div>
          <div>population {population}</div>
          <h2>languages</h2>
          <ul>
            {languages.map((lng) => (
              <li key={lng.name}>{lng.name}</li>
            ))}
          </ul>
          <img src={flag} width={100} alt={alt} />
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

  return (
    <div>
      <div>
        find countries <input value={country} onChange={handleCountry} />
      </div>
      {handleCountriesToShow()}
    </div>
  );
};

export default App;
