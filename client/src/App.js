import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import NotFound from './pages/notFound';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false);

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={isLoggedIn? <Home setIsLoggedIn={setIsLoggedIn}/> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/login' element={ isLoggedIn ? <Home setIsLoggedIn={setIsLoggedIn}/> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
