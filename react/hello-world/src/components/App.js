import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ContainerTable from './ContainerTable'
import Nav from './nav'
import LoginForm from './LoginForm'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [containers, setContainers] = useState([])

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    document.body.setAttribute('data-bs-theme', savedTheme)
  }

  const handleLogin = (username, password) => {
    axios.defaults.headers.common.Authorization = `Basic ${btoa(username + ':' + password)}`
    setIsAuthenticated(true)
    fetchContainers()
  }

  const handleLogout = () => {
    delete axios.defaults.headers.common.Authorization
    setIsAuthenticated(false)
  }

  useEffect(() => {
    const fetchContainers = async () => {
      const result = await axios.get('/api/containers')
      setContainers(result.data)
    }

    fetchContainers()
  }, [])

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status === 403) {
          handleLogout()
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [])

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // replace /api/protected with the actual endpoint
        await axios.get('/api/containers')
        setIsAuthenticated(true)
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setIsAuthenticated(false)
        }
      }
    }

    checkAuthentication()
  }, [])

  const fetchContainers = async () => {
    try {
      const result = await axios.get('/api/containers')
      setContainers(result.data)
      setIsAuthenticated(true) // This assumes successful fetching of containers means user is authenticated
    } catch (error) {
      console.error(error)
      if (error.response && error.response.status === 403) {
        setIsAuthenticated(false)
      }
    }
  }

  useEffect(() => {
    fetchContainers()
  }, [])

  return (
    <div className='App'>
      <Nav isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      {isAuthenticated ? <ContainerTable containers={containers} setContainers={setContainers} fetchContainers={fetchContainers} /> : <LoginForm onLogin={handleLogin} onSuccessfulLogin={fetchContainers} />}
    </div>
  )
}

export default App
