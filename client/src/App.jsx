import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestionList from './pages/QuestionList';
import QuestionPage from './pages/QuestionPage';
import Signup from './pages/Signup';
import HomePage from './pages/Home';
import Login from './pages/Login';
import UserPreferencesModal from './components/UserPreferencesModal';
import ProfilePage from './pages/Profile';
import CourseList from './pages/CourseList';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
          path="/modal"
          element={
            <UserPreferencesModal
              isOpen={true}
              onRequestClose={() => {}}
              onSave={() => {}}
            />
          }
      />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/courses/:courseId/questions" element={<QuestionList />} />
      <Route path="/questions/:questionId" element={<QuestionPage />} />
    </Routes>
  </Router>
);

export default App;
