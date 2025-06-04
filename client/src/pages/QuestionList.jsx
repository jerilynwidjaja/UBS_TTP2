import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const QuestionList = () => {
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get(`http://13.229.46.111:5000/courses/${courseId}/questions`)
      .then(res => setQuestions(res.data));
  }, [courseId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Course Questions</h1>
      {questions.map(q => (
        <Link key={q.id} to={`/questions/${q.id}`}>
          <div className="p-4 mb-2 border rounded hover:bg-gray-100 cursor-pointer">
            <h2 className="text-lg font-semibold">{q.title}</h2>
            <p>{q.description?.slice(0, 100)}...</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuestionList;
