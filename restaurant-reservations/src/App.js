import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Importa el archivo CSS

function App() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 1
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
        setSuccessMessage('');  // Asegúrate de limpiar el mensaje de éxito cuando se envíe el formulario
    };

    const handleConfirm = () => {
        axios.post('http://localhost:3000/reservations', formData)
            .then(response => {
                setSuccessMessage(`Reservation made with ID: ${response.data.id}`);
                // Resetea el formulario y oculta la confirmación después de la confirmación exitosa
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '',
                    guests: 1
                });
                setShowConfirmation(false);
            })
            .catch(error => {
                console.error('There was an error making the reservation!', error);
            });
    };

    return (
        <div className="App">
            <h1>Restaurant Reservation</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
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
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    min="1"
                    required
                />
                <button type="submit">Reserve</button>
            </form>

            {showConfirmation && (
                <div className="confirmation">
                    <h2>Confirm your reservation</h2>
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Date:</strong> {formData.date}</p>
                    <p><strong>Time:</strong> {formData.time}</p>
                    <p><strong>Guests:</strong> {formData.guests}</p>
                    <button onClick={handleConfirm}>Confirm Reservation</button>
                    <button onClick={() => setShowConfirmation(false)}>Edit</button>
                </div>
            )}

            {successMessage && (
                <div className="success-message">
                    <p>{successMessage}</p>
                </div>
            )}
        </div>
    );
}

export default App;
