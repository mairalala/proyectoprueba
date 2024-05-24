import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Importa el archivo CSS

function App() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = () => {
        const { username, email, password, confirmPassword } = formData;
        
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        axios.post('http://localhost:3000/register', { username, email, password })
            .then(response => {
                setShowConfirmation(true);
                setErrorMessage('');
                console.log(response.data);
            })
            .catch(error => {
                setErrorMessage('Error registering user');
                console.error('Error registering user:', error);
            });
    };

    return (
        <div className="App">
            <h1>User Registration</h1>
            <form>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button type="button" onClick={handleRegister}>Register</button>
            </form>

            {showConfirmation && (
                <div className="confirmation">
                    <h2>Registration Successful</h2>
                    <p>Your account has been successfully registered.</p>
                </div>
            )}

            {errorMessage && (
                <div className="error-message">
                    <p>{errorMessage}</p>
                </div>
            )}
        </div>
    );
}

export default App;
