import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://13.229.96.169:5000/courses').then(res => setCourses(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
      {courses.map(course => (
        <Link key={course.id} to={`/courses/${course.id}/questions`}>
          <div className="p-4 mb-2 border rounded hover:bg-gray-100 cursor-pointer">
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p>{course.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CourseList;
