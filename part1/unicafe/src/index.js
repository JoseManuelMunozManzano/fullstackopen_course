import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Header = () => <h1>give feedback</h1>;

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const StatisticsHeader = () => <h1>statistics</h1>;

const StatisticsText = ({ text, value }) => (
  <p>
    {text} {value}
  </p>
);

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <Header />

      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />

      <StatisticsHeader />

      <StatisticsText text="good" value={good} />
      <StatisticsText text="neutral" value={neutral} />
      <StatisticsText text="bad" value={bad} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
