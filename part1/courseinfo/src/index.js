import React from 'react';
import ReactDOM from 'react-dom';

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = ({ part }) => {
  const { name, exercises } = part;

  return (
    <p>
      {name} {exercises}
    </p>
  );
};

const Content = ({ part1, part2, part3 }) => {
  return (
    <div>
      <Part part={part1} />
      <Part part={part2} />
      <Part part={part3} />
    </div>
  );
};

const Total = (props) => {
  return <p>Number of exercises {props.totalExercises}</p>;
};

const App = () => {
  const course = 'Half Stack application development';
  const part1 = { name: 'Fundamentals of React', exercises: 10 };
  const part2 = { name: 'Using props to pass data', exercises: 7 };
  const part3 = { name: 'State of a component', exercises: 14 };

  return (
    <div>
      <Header course={course} />

      <Content part1={part1} part2={part2} part3={part3} />

      <Total
        totalExercises={part1.exercises + part2.exercises + part3.exercises}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
