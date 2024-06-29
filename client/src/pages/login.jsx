import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/login.css';
import { userApi } from '../apis';
import toast from 'react-hot-toast';

const Login = ({ setIsLoggedIn }) => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging In");

        try {
            const response = await userApi.post('/login', {
                username,
                password
            });

            console.log(response.data);
            if (response.data.success) {
                const token = response.data.token;
                localStorage.setItem('token', JSON.stringify(token));
                setIsLoggedIn(true);
                toast.success("Successfully logged in");
                navigate('/');

            } else {
                console.log(response.data.message);
                toast.error(response.data.message);
                navigate('/login')                          // api sends an object {user, success, message}
            }

        } catch (error) {
            console.log("Login Error", error);
            toast.error(`Oops! Server Issue :( \n Lemme fix it in a minute...`)
        }
        finally {
            setPassword('');
            setUsername('');
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="login-container Login">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">

                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required

                        />
                    </div>
                    <button type="submit" className="btn">Login</button>
                </form>
                <p className="forgot-password">
                    New user? <Link to={'/register'}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
