import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Question {
  id: number;
  title: string;
  description: string;
  starterCode: string;
  languageId: number;
  expectedOutput: string;
  difficulty: string;
  courseId: number;
}

interface ExecutionResult {
  passed: boolean;
  output: string;
  error: string | null;
  status: string;
}

const QuestionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`http://52.221.205.14:8000/api/questions/${id}`);
      const questionData = response.data.question;
      setQuestion(questionData);
      setCode(questionData.starterCode || '');
    } catch (error) {
      toast.error('Failed to load question');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const executeCode = async () => {
    if (!question) return;
    
    setExecuting(true);
    setResult(null);
    
    try {
      const response = await axios.post(`http://52.221.205.14:8000/api/questions/${question.id}/submit`, {
        code
      });
      
      setResult(response.data);
      
      if (response.data.passed) {
        toast.success('Congratulations! Your solution is correct! 🎉');
      } else {
        toast.error('Your solution needs some work. Keep trying!');
      }
    } catch (error: any) {
      toast.error('Failed to execute code');
      setResult({
        passed: false,
        output: '',
        error: error.response?.data?.message || 'Execution failed',
        status: 'Error'
      });
    } finally {
      setExecuting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Question not found</h2>
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-600 hover:text-blue-800"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(`/course/${question.courseId}`)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Course
            </button>
            
            <button
              onClick={executeCode}
              disabled={executing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {executing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {executing ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Question Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{question.description}</p>
              
              {question.expectedOutput && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Expected Output:</h3>
                  <code className="text-blue-800">{question.expectedOutput}</code>
                </div>
              )}
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Code Editor</h2>
            </div>
            
            <div className="flex-1">
              <Editor
                height="60%"
                defaultLanguage="javascript"
                value={code}
                onChange={handleCodeChange}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on'
                }}
              />
            </div>
            
            {/* Results Panel */}
            {result && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center mb-3">
                  {result.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <h3 className={`font-semibold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {result.passed ? 'Success!' : 'Failed'}
                  </h3>
                </div>
                
                {result.output && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Output:</h4>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">{result.output}</pre>
                  </div>
                )}
                
                {result.error && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-red-700 mb-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Error:
                    </h4>
                    <pre className="bg-red-50 text-red-800 p-2 rounded text-sm overflow-x-auto">{result.error}</pre>
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  Status: {result.status}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionView;