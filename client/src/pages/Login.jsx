import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://13.229.96.169:5000/auth/login',
        {
          email,
          password,
        }
      );
      localStorage.setItem('token', res.data.token);
      navigate('/modal');
    } catch (err) {
      alert('Login failed: ' + err.response.data.message);
    }
  };

  return (
    <div>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>UBS</h2>
        <div>
          <Link to="/signup" style={styles.link}>
            Signup
          </Link>
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </div>
      </nav>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#282c34',
    color: '#fff',
  },
  logo: {
    margin: 0,
  },
  link: {
    marginLeft: '1rem',
    color: '#61dafb',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  main: {
    padding: '2rem',
    textAlign: 'center',
  },
};

export default Login;
