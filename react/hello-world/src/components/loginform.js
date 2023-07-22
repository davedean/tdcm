import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContainerTable from './containers';
import Nav from './nav';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    axios.defaults.headers.common['Authorization'] = `Basic ${btoa(username + ':' + password)}`;
    setIsAuthenticated(true);
  };


  const handleLogout = () => {
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };


  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response, 
      error => {
        if (error.response.status === 403) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);


  return (
    <div className="App">
        <Nav isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      {isAuthenticated ? <ContainerTable /> : <LoginForm onLogin={handleLogin} />}
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="d-flex justify-content-center">
    <form onSubmit={handleSubmit} className="p-3" style={{maxWidth: '400px'}}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input 
              type="text" 
              id="username"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">Log In</button>
        </form>
        </div>
      );
}

export default App;
