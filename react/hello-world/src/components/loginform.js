import React, { useState } from 'react';
import axios from 'axios';
import ContainerTable from './containers';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    axios.defaults.headers.common['Authorization'] = `Basic ${btoa(username + ':' + password)}`;
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
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
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <input type="submit" value="Log In" />
    </form>
  );
}

export default App;
