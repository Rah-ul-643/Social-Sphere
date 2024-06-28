import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('user') ? true : false);

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={isLoggedIn? <Home setIsLoggedIn={setIsLoggedIn}/> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/login' element={ isLoggedIn ? <Home setIsLoggedIn={setIsLoggedIn}/> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
