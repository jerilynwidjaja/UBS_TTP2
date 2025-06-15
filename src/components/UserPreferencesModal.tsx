import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    careerStage: '',
    skills: [] as string[],
    learningGoals: [] as string[],
    timeAvailability: '',
    level: ''
  });
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  const toggleArrayItem = (item: string, field: 'skills' | 'learningGoals') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://52.221.205.14:8000/api/auth/preferences', formData);
      updateUser({ hasPreferences: true });
      toast.success('Preferences saved successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Set Up Your Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Career Stage
            </label>
            <select
              value={formData.careerStage}
              onChange={(e) => setFormData({ ...formData, careerStage: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select your career stage</option>
              <option value="student">Student</option>
              <option value="early">Early Career</option>
              <option value="mid">Mid Career</option>
              <option value="senior">Senior/Lead</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Skills
            </label>
            <div className="space-y-2">
              {['JavaScript', 'Python', 'SQL', 'React', 'Node.js', 'Java', 'C++'].map((skill) => (
                <label key={skill} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => toggleArrayItem(skill, 'skills')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Level
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select your level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Goals
            </label>
            <div className="space-y-2">
              {['Web Development', 'Data Science', 'AI/ML', 'Cloud Computing', 'Mobile Development', 'DevOps'].map((goal) => (
                <label key={goal} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.learningGoals.includes(goal)}
                    onChange={() => toggleArrayItem(goal, 'learningGoals')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Availability (per week)
            </label>
            <select
              value={formData.timeAvailability}
              onChange={(e) => setFormData({ ...formData, timeAvailability: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select time commitment</option>
              <option value="1-3">1-3 hours/week</option>
              <option value="4-6">4-6 hours/week</option>
              <option value="7-10">7-10 hours/week</option>
              <option value="10+">10+ hours/week</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPreferencesModal;