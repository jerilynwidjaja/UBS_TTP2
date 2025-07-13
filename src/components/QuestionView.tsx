import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle2, XCircle, AlertCircle, Code } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { QuestionService, Question, ExecutionResult } from '../services/questionService';

// Lazy load Monaco Editor
const Editor = lazy(() => import('@monaco-editor/react'));

// Lightweight fallback editor for immediate use
const FallbackEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  language: string;
  isDarkMode?: boolean;
}> = ({ value, onChange, language, isDarkMode }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = language === 'python' ? '    ' : '  ';
      
      textarea.value = textarea.value.substring(0, start) + spaces + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      onChange(textarea.value);
    }
  };

  return (
    <div className="relative h-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Loading full editor... You can start typing here."
        className={`w-full h-full resize-none p-4 pl-12 font-mono text-sm leading-relaxed border-0 outline-none ${
          isDarkMode 
            ? 'bg-gray-900 text-gray-100 placeholder-gray-500' 
            : 'bg-white text-gray-900 placeholder-gray-400'
        }`}
        style={{
          minHeight: '400px',
          tabSize: language === 'python' ? 4 : 2,
        }}
      />
      
      <div className={`absolute left-0 top-0 w-10 h-full pointer-events-none border-r ${
        isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400'
      }`}>
        {value.split('\n').map((_, index) => (
          <div
            key={index}
            className="text-xs text-right pr-2 py-0.5"
            style={{ lineHeight: '1.5rem' }}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

const QuestionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [question, setQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [monacoReady, setMonacoReady] = useState(false);
  const [showFullEditor, setShowFullEditor] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQuestion();
    }
  }, [id]);

  // Start loading Monaco Editor after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFullEditor(true);
    }, 100); // Small delay to let the page render first

    return () => clearTimeout(timer);
  }, []);

  const fetchQuestion = async () => {
    if (!id) return;
    
    try {
      const questionData = await QuestionService.getQuestionById(id);
      setQuestion(questionData);
      setCode(questionData.starterCode || '');
    } catch (error) {
      toast.error('Failed to load question');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = useCallback((value: string | undefined) => {
    setCode(value || '');
  }, []);

  const executeCode = useCallback(async () => {
    if (!question || executing) return;
    
    setExecuting(true);
    setResult(null);
    
    try {
      const executionResult = await QuestionService.submitCode(question.id, code);
      setResult(executionResult);
      
      if (executionResult.passed) {
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
  }, [question, code, executing]);

  // Optimized Monaco Editor options
  const editorOptions = useMemo(() => ({
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on' as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: question?.languageId === 'python' ? 4 : 2,
    wordWrap: 'on' as const,
    folding: true,
    autoIndent: 'full' as const,
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on' as const,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false
    },
    parameterHints: { enabled: true },
    hover: { enabled: true },
    matchBrackets: 'always' as const,
    // Performance optimizations
    renderWhitespace: 'none' as const,
    renderIndentGuides: false,
    renderLineHighlight: 'line' as const,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8
    },
    // Fast loading optimizations
    wordBasedSuggestions: false,
    occurrencesHighlight: false,
    selectionHighlight: false,
    codeLens: false,
    colorDecorators: false,
    links: false,
    // Reduce worker usage
    semanticHighlighting: { enabled: false }
  }), [question?.languageId]);

  const languageConfig = useMemo(() => 
    question ? QuestionService.getLanguageConfig(question.languageId) : null,
    [question?.languageId]
  );

  const handleMonacoMount = useCallback(() => {
    setMonacoReady(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question || !languageConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Question not found</h2>
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/course/${question.courseId}`)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Course
              </button>
              
              <div className="flex items-center">
                <Code className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{question.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${QuestionService.getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                <Code className="h-4 w-4 mr-1" />
                <span>{languageConfig.name}</span>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose max-w-none">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {question.description}
                </div>
                
                {question.expectedOutput && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Expected Output:
                    </h3>
                    <code className="text-blue-800 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-sm">
                      {question.expectedOutput}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Code Editor
                </h2>
                <div className="flex items-center space-x-2">
                  {!monacoReady && showFullEditor && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-1"></div>
                      Loading full editor...
                    </div>
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {languageConfig.name} (.{languageConfig.extension})
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative">
              {showFullEditor ? (
                <Suspense fallback={
                  <FallbackEditor 
                    value={code} 
                    onChange={handleCodeChange} 
                    language={languageConfig.monaco}
                    isDarkMode={isDarkMode}
                  />
                }>
                  <Editor
                    height="60%"
                    language={languageConfig.monaco}
                    value={code}
                    onChange={handleCodeChange}
                    onMount={handleMonacoMount}
                    theme={isDarkMode ? "vs-dark" : "vs-light"}
                    options={editorOptions}
                    beforeMount={(monaco) => {
                      // Configure Monaco to load faster
                      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
                      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
                    }}
                  />
                </Suspense>
              ) : (
                <FallbackEditor 
                  value={code} 
                  onChange={handleCodeChange} 
                  language={languageConfig.monaco}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
            
            {/* Results Panel */}
            {result && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center mb-3">
                  {result.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <h3 className={`font-semibold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {result.passed ? 'Success! ✨' : 'Failed ❌'}
                  </h3>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                    {result.status}
                  </span>
                </div>
                
                {result.output && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-1" />
                      Output:
                    </h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg text-sm overflow-x-auto font-mono">
                      {result.output}
                    </pre>
                  </div>
                )}
                
                {result.error && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Error:
                    </h4>
                    <pre className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 p-3 rounded-lg text-sm overflow-x-auto font-mono">
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