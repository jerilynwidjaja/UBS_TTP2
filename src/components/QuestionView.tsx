import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle2, XCircle, AlertCircle, Code } from 'lucide-react';
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

interface LanguageConfig {
  name: string;
  monaco: string;
  extension: string;
}

const LANGUAGE_CONFIG: Record<number, LanguageConfig> = {
  63: { name: 'JavaScript', monaco: 'javascript', extension: 'js' },
  71: { name: 'Python', monaco: 'python', extension: 'py' },
  62: { name: 'Java', monaco: 'java', extension: 'java' },
  54: { name: 'C++', monaco: 'cpp', extension: 'cpp' },
  50: { name: 'C', monaco: 'c', extension: 'c' },
  51: { name: 'C#', monaco: 'csharp', extension: 'cs' },
  78: { name: 'Kotlin', monaco: 'kotlin', extension: 'kt' },
  72: { name: 'Ruby', monaco: 'ruby', extension: 'rb' },
  73: { name: 'Rust', monaco: 'rust', extension: 'rs' },
  68: { name: 'PHP', monaco: 'php', extension: 'php' },
  60: { name: 'Go', monaco: 'go', extension: 'go' },
  74: { name: 'TypeScript', monaco: 'typescript', extension: 'ts' },
  82: { name: 'SQL', monaco: 'sql', extension: 'sql' },
  75: { name: 'Swift', monaco: 'swift', extension: 'swift' }
};

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
      const response = await axios.get(`http://localhost:5000/api/questions/${id}`);
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
      const response = await axios.post(`http://localhost:5000/api/questions/${question.id}/submit`, {
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLanguageConfig = (languageId: number): LanguageConfig => {
    return LANGUAGE_CONFIG[languageId] || LANGUAGE_CONFIG[63];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Question not found</h2>
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  const languageConfig = getLanguageConfig(question.languageId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/course/${question.courseId}`)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Course
              </button>
              
              <div className="flex items-center">
                <Code className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {languageConfig.name}
                </span>
              </div>
            </div>
            
            <button
              onClick={executeCode}
              disabled={executing}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Question Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Code className="h-4 w-4 mr-1" />
                <span>{languageConfig.name}</span>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {question.description}
                </div>
                
                {question.expectedOutput && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Expected Output:
                    </h3>
                    <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded text-sm">
                      {question.expectedOutput}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-600" />
                  Code Editor
                </h2>
                <div className="text-sm text-gray-600">
                  {languageConfig.name} (.{languageConfig.extension})
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <Editor
                height="60%"
                language={languageConfig.monaco}
                value={code}
                onChange={handleCodeChange}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: languageConfig.monaco === 'python' ? 4 : 2,
                  wordWrap: 'on',
                  folding: true,
                  autoIndent: 'full',
                  formatOnPaste: true,
                  formatOnType: true,
                  suggestOnTriggerCharacters: true,
                  acceptSuggestionOnEnter: 'on',
                  quickSuggestions: true,
                  parameterHints: { enabled: true },
                  hover: { enabled: true },
                  matchBrackets: 'always'
                }}
              />
            </div>
            
            {/* Results Panel */}
            {result && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center mb-3">
                  {result.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <h3 className={`font-semibold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {result.passed ? 'Success! ✨' : 'Failed ❌'}
                  </h3>
                  <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {result.status}
                  </span>
                </div>
                
                {result.output && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-1" />
                      Output:
                    </h4>
                    <pre className="bg-gray-100 border border-gray-200 p-3 rounded-lg text-sm overflow-x-auto font-mono">
                      {result.output}
                    </pre>
                  </div>
                )}
                
                {result.error && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Error:
                    </h4>
                    <pre className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm overflow-x-auto font-mono">
                      {result.error}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionView;