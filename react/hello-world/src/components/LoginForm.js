import React, { useState, useEffect } from 'react'
import axios from 'axios'

function LoginForm ({ onLogin, onSuccessfulLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(username, password)

    // event.preventDefault();
    const authString = `${username}:${password}`

    try {
      // await
      axios.get('/api/containers', {
        headers: { Authorization: `Basic ${btoa(authString)}` }
      })
      onSuccessfulLogin()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='d-flex justify-content-center'>
      <form onSubmit={handleSubmit} className='p-3' style={{ maxWidth: '400px' }}>
        <div className='form-group'>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='form-control'
          />
        </div>
        <button type='submit' className='btn btn-primary'>Log In</button>
      </form>
    </div>
  )
}

export default LoginForm
