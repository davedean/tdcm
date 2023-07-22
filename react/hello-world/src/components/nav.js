import React, { useState } from 'react';
import axios from 'axios';
import ContainerTable from './containers';



function Nav({ isAuthenticated, onLogout }) 
{
return (
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
<div class="container-fluid">
  <a class="navbar-brand" href="/">Tiny Docker Container Manager</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item dropdown">
        <button class="btn btn-link nav-link py-2 px-0 px-lg-2 dropdown-toggle d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" data-bs-display="static" aria-label="Toggle theme (light)">
          <svg class="bi my-1 theme-icon-active"><use href="#sun-fill"></use></svg>
          <span class="d-lg-none ms-2" id="bd-theme-text">Toggle theme</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">
          <li>
            <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="light" aria-pressed="true">
              <svg class="bi me-2 opacity-50 theme-icon"><use href="#sun-fill"></use></svg>
              Light
              <svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
            </button>
          </li>
          <li>
            <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false">
              <svg class="bi me-2 opacity-50 theme-icon"><use href="#moon-stars-fill"></use></svg>
              Dark
              <svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
            </button>
          </li>
          <li>
            <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="auto" aria-pressed="false">
              <svg class="bi me-2 opacity-50 theme-icon"><use href="#circle-half"></use></svg>
              Auto
              <svg class="bi ms-auto d-none"><use href="#check2"></use></svg>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div>
  {isAuthenticated && <button className="btn btn-outline-secondary" onClick={onLogout}>Logout</button>}
</div>
</div>
</nav>
)
}

export default Nav