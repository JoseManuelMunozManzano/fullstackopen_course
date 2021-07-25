import Content from './Content';
import Header from './Header';
import Total from './Total';

export default function Course({ course }) {
  return (
    <>
      <Header course={course} />
      {course.parts.map((part) => (
        <Content key={part.id} course={part} />
      ))}
      <Total course={course} />
    </>
  );
}
