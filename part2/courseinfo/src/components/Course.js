import Content from './Content';
import Header from './Header';

export default function Course({ course }) {
  return (
    <>
      <Header course={course} />
      {course.parts.map((part) => (
        <Content key={part.id} course={part} />
      ))}
    </>
  );
}
