import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../static/logo.gif';
import './css/notFound.css';

const NotFound = () => {
  return (
    <div className='Not-Found'>
        <h1>404 Page not found</h1>
        <Link to={'/'}>Home</Link>
        <div>
            <img src={logo} alt="" />
        </div>
    </div>
  )
}

export default NotFound;