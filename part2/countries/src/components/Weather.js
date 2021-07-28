import React from 'react';

export const Weather = ({ countriesToShow, weather }) => {
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

  return <>{handleWeather()}</>;
};
