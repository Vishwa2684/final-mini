import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to='/LiveFeed'>
              <i className="fa-solid fa-house"></i>
              LiveFeed
            </NavLink>
          </li>
          <li>
            <NavLink to='/Attendance'>
              <i className="fa-solid fa-futbol"></i>
              Attendance Log
            </NavLink>
          </li>
          <li>
            <NavLink to='/Directory'>
              <i className="fa-solid fa-calendar"></i>
              Directory
            </NavLink>
          </li>
          <li>
            <NavLink to='/Settings'>
              <i className="fa-solid fa-envelope"></i>
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink to='/signup'>
              <i className="fa-solid fa-envelope"></i>
              Signup
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;