import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const Header = () => <h1>give feedback</h1>;

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const StatisticsHeader = () => <h1>statistics</h1>;

const Statistic = ({ text, value, sign = '' }) => {
  return (
    <p>
      {text} {value} {sign}
    </p>
  );
};

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  return (
    <div>
      <Statistic text="good" value={good} />
      <Statistic text="neutral" value={neutral} />
      <Statistic text="bad" value={bad} />
      <Statistic text="all" value={all} />
      <Statistic text="average" value={average} />
      <Statistic text="positive" value={positive} sign="%" />
    </div>
  );
};

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

      {all.current ? (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          all={all.current}
          average={average.current}
          positive={positive.current}
        />
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
