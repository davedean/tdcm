import React, { useState } from 'react'

function Nav ({ isAuthenticated, onLogout }) {
  const handleThemeChange = (theme) => {
    console.log('Changing theme to: ', theme)
    document.body.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  }

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='/'>Tiny Docker Container Manager</a>
        <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon' />
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'> {/* Add navbar-nav class */}
            <li className='nav-item dropdown'>
              <button className='btn btn-link nav-link py-2 px-0 px-lg-2 dropdown-toggle d-flex align-items-center' id='bd-theme' type='button' aria-expanded='false' data-bs-toggle='dropdown' data-bs-display='static' aria-label='Toggle theme (light)'>
                <svg className='bi my-1 theme-icon-active'><use href='#sun-fill' /></svg>
                <span className='d-lg-none ms-2' id='bd-theme-text'>Toggle theme</span>
              </button>
              <ul className='dropdown-menu dropdown-menu-end' aria-labelledby='bd-theme-text'>
                <li>
                  <button
                    type='button'
                    className='dropdown-item d-flex align-items-center active'
                    onClick={() => handleThemeChange('light')}
                    aria-pressed='true'
                  >
                    <svg className='bi me-2 opacity-50 theme-icon'><use href='#sun-fill' /></svg>
                    Light
                    <svg className='bi ms-auto d-none'><use href='#check2' /></svg>
                  </button>
                </li>
                <li>
                  <button
                    type='button'
                    className='dropdown-item d-flex align-items-center'
                    onClick={() => handleThemeChange('dark')}
                    aria-pressed='false'
                  >
                    <svg className='bi me-2 opacity-50 theme-icon'><use href='#moon-stars-fill' /></svg>
                    Dark
                    <svg className='bi ms-auto d-none'><use href='#check2' /></svg>
                  </button>
                </li>
                <li>
                  <button
                    type='button'
                    className='dropdown-item d-flex align-items-center'
                    onClick={() => handleThemeChange('auto')}
                    aria-pressed='false'
                  >
                    <svg className='bi me-2 opacity-50 theme-icon'><use href='#circle-half' /></svg>
                    Auto
                    <svg className='bi ms-auto d-none'><use href='#check2' /></svg>
                  </button>
                </li>
              </ul>
            </li>
            <li>
              {isAuthenticated && <button className='btn btn-outline-secondary' onClick={onLogout}>Logout</button>}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav
