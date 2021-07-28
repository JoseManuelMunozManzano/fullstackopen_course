import React from 'react';

export const Filter = ({ country, handleCountry }) => {
  return (
    <div>
      find countries <input value={country} onChange={handleCountry} />
    </div>
  );
};
