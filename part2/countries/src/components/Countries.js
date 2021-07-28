import React from 'react';
import { Country } from './Country';

export const Countries = ({ countriesToShow, handleShowCountry }) => {
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
            {languages.map((language) => (
              <Country key={language.name} language={language} />
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

  return <>{handleCountriesToShow()}</>;
};
