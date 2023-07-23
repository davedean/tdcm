import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContainerTable from './ContainerTable';
import Nav from './nav';
import LoginForm from './LoginForm';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [containers, setContainers] = useState([]);


  const handleLogin = (username, password) => {
    axios.defaults.headers.common['Authorization'] = `Basic ${btoa(username + ':' + password)}`;
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };


  useEffect(() => {
    const fetchContainers = async () => {
      const result = await axios.get('/api/containers');
      setContainers(result.data);
    };

    fetchContainers();
  }, []);

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
      {isAuthenticated ? <ContainerTable containers={containers} setContainers={setContainers} /> : <LoginForm onLogin={handleLogin} />}
    </div>
  );
  
};

/*


  return (
    <div className="App">
      <ContainerTable containers={containers} setContainers={setContainers} />
    </div>
  );


function AppRender() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [containers, setContainers] = useState([]);

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
      {isAuthenticated ? <ContainerTable containers={containers} setContainers={setContainers} /> : <LoginForm onLogin={handleLogin} />}
    </div>
  );
}

*/
export default App;
