import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';

const QuestionPage = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/questions/${questionId}`).then(res => {
      setQuestion(res.data);
      setCode(res.data.starter_code);
    });
  }, [questionId]);

  const handleRun = async () => {
    try {
      const res = await axios.post('http://localhost:5000/code/run', {
        source_code: code,
        language_id: question.language_id,
        stdin: '',
      });
      setOutput(res.data.output);
    } catch (err) {
      console.error(err);
      setOutput('Error running code');
    }
  };

  if (!question) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{question.title}</h1>
      <p className="mb-4">{question.description}</p>
      <Editor
        height="400px"
        defaultLanguage="cpp"
        value={code}
        onChange={(val) => setCode(val)}
      />
      <button onClick={handleRun} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Run Code
      </button>
      <pre className="mt-4 bg-gray-100 p-2 border rounded">{output}</pre>
    </div>
  );
};

export default QuestionPage;
