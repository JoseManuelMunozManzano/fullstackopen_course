const Total = ({ course }) => {
  const total = course.parts.reduce((acum, part) => acum + part.exercises, 0);

  return (
    <p>
      <b>total of {total} exercises</b>
    </p>
  );
};

export default Total;
