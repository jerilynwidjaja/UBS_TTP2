import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const UserPreferencesModal = ({ isOpen, onRequestClose }) => {
  const navigate = useNavigate();
  const [careerStage, setCareerStage] = useState('');
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [timeAvailability, setTimeAvailability] = useState('');
  const [level, setLevel] = useState('');

  const toggleItem = (item, list, setList) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const preferences = {
        careerStage,
        skills,
        goals,
        timeAvailability,
        level,
      };
      await axios.post(
        'http://54.255.153.51:5000/auth/career-details',
        preferences,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/profile');
    } catch (err) {
      alert('Error saving details: ' + err.response.data.message);
    }
  };

  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
    content: {
      maxWidth: '500px',
      margin: 'auto',
      borderRadius: '8px',
      padding: '20px',
      inset: '10% auto auto auto',
    },
  };

  const sectionStyle = { marginBottom: '15px' };
  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  };
  const fieldsetStyle = { marginBottom: '15px', border: 'none' };
  const checkboxLabelStyle = { display: 'block', marginBottom: '5px' };
  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  };
  const buttonStyle = { padding: '8px 16px', cursor: 'pointer' };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User Preferences Modal"
      style={modalStyles}
    >
      <div>
        <h2 style={{ marginTop: 0 }}>User Preferences</h2>

        <div style={sectionStyle}>
          <label style={labelStyle}>Career Stage:</label>
          <select
            value={careerStage}
            onChange={(e) => setCareerStage(e.target.value)}
          >
            <option value="">Select</option>
            <option value="student">Student</option>
            <option value="early">Early Career</option>
            <option value="mid">Mid Career</option>
            <option value="senior">Senior/Lead</option>
          </select>
        </div>

        <fieldset style={fieldsetStyle}>
          <legend style={labelStyle}>Skills:</legend>
          {['JavaScript', 'Python', 'SQL', 'React'].map((skill) => (
            <label key={skill} style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={skills.includes(skill)}
                onChange={() => toggleItem(skill, skills, setSkills)}
              />{' '}
              {skill}
            </label>
          ))}
        </fieldset>

        <div style={sectionStyle}>
          <label style={labelStyle}>Level:</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Select</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <fieldset style={fieldsetStyle}>
          <legend style={labelStyle}>Learning Goals:</legend>
          {['Web Development', 'Data Science', 'AI/ML', 'Cloud Computing'].map(
            (goal) => (
              <label key={goal} style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={goals.includes(goal)}
                  onChange={() => toggleItem(goal, goals, setGoals)}
                />{' '}
                {goal}
              </label>
            )
          )}
        </fieldset>

        <div style={sectionStyle}>
          <label style={labelStyle}>Time Availability:</label>
          <select
            value={timeAvailability}
            onChange={(e) => setTimeAvailability(e.target.value)}
          >
            <option value="">Select</option>
            <option value="1-3">1–3 hrs/week</option>
            <option value="4-6">4–6 hrs/week</option>
            <option value="7+">7+ hrs/week</option>
          </select>
        </div>

        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={handleSave}>
            Save
          </button>
          <button style={buttonStyle} onClick={onRequestClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserPreferencesModal;
