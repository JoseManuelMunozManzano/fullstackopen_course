import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const Header = () => <h1>give feedback</h1>;

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const StatisticsHeader = () => <h1>statistics</h1>;

const StatisticsText = ({ text, value, sign = '' }) => (
  <p>
    {text} {value} {sign}
  </p>
);

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = useRef(0);
  const average = useRef(0);
  const positive = useRef(0);

  const handleGood = () => {
    setGood(good + 1);
  };

  const handleNeutral = () => {
    setNeutral(neutral + 1);
  };

  const handleBad = () => {
    setBad(bad + 1);
  };

  all.current = good + neutral + bad;
  if (all.current) {
    average.current = (good - bad) / (good + neutral + bad);
    positive.current = (good * 100) / (good + neutral + bad);
  }

  return (
    <div>
      <Header />

      <Button text="good" handleClick={handleGood} />
      <Button text="neutral" handleClick={handleNeutral} />
      <Button text="bad" handleClick={handleBad} />

      <StatisticsHeader />

      <StatisticsText text="good" value={good} />
      <StatisticsText text="neutral" value={neutral} />
      <StatisticsText text="bad" value={bad} />
      <StatisticsText text="all" value={all.current} />
      <StatisticsText text="average" value={average.current} />
      <StatisticsText text="positive" value={positive.current} sign="%" />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));