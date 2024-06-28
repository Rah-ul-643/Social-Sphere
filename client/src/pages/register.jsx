
import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';

import {api} from '../apis';
import './css/register.css';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === password2) {
      const toastId = toast.loading('Registering User...');
      try {
        const response = await api.post('/register', {
          name,
          username,
          password
        });

        console.log(response.data);

        if (response.data.success) {                   // api sends an object {success,message}
          toast.success(response.data.message);
          navigate('/login');

        } else {
          toast.error(response.data.message);
        }



      } catch (error) {
        console.log("signup Error", error);
        toast.error(`Oops! Server Issue :( \n Lemme fix it in a minute...`);

      }
      finally {
        setName('');
        setPassword('');
        setUsername('');
        setPassword2('');
        toast.dismiss(toastId);
      }
    }
    else {
      toast.error("Password does not match");
    }
  };

  return (
    <div className="Register register-container">
      <div className="register-form">
        <h2>Sign-Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder='Full Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder='Create Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Re-type Password</label>
            <input
              type="password"
              id="password2"
              placeholder='Re-Password'
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Register</button>
        </form>
        <p className="login">
          Already Registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;